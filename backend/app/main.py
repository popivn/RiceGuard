from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import io
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.imagenet_utils import preprocess_input
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from pathlib import Path
import logging

# Get the directory containing the current file
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env file
env_path = BASE_DIR / '.env'
load_dotenv(env_path)

# Debug print
logging.info(f"Loading .env from: {env_path}")
logging.info(f"PORT from env: {os.getenv('PORT')}")
logging.info(f"APP_URL from env: {os.getenv('APP_URL')}")
logging.info(f"Environment: {os.getenv('ENV', 'development')}")

app = FastAPI()

# Configure CORS based on environment
if os.getenv("ENV") == "production":
    # Production CORS settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[os.getenv("APP_URL")],  # Use APP_URL from environment
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Development CORS settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins in development
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Initialize model (will be loaded on first request)
mobilenet_model = None

# Image size for model input
IMG_SIZE = 224

# Class indices
class_indices = {
    'black spot': 0,
    'greening': 1,
    'healthy': 2,
    'scab': 3,
    'thrips': 4
}

# Reverse mapping for prediction
class_names = {v: k for k, v in class_indices.items()}


def load_models():
    global mobilenet_model
    try:
        if mobilenet_model is None:
            model_path = BASE_DIR / "models" / "best_lemon.keras"
            logging.info(f"Loading MobileNet model from: {model_path}")
            print(f"Loading MobileNet model from: {model_path}")
            if not model_path.exists():
                raise FileNotFoundError(
                    f"MobileNet model not found at {model_path}"
                )
            try:
                mobilenet_model = tf.keras.models.load_model(str(model_path))
                logging.info("MobileNet model loaded successfully")
                print("MobileNet model loaded successfully")
            except Exception as e:
                logging.error(f"Error loading MobileNet model: {str(e)}")
                print(f"Error loading MobileNet model: {str(e)}")
                raise
    except Exception as e:
        logging.error(f"Failed to load models: {str(e)}")
        print(f"Failed to load models: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load models: {str(e)}"
        )


@app.get("/")
async def root():
    return {"message": "Image Detection API"}


@app.post("/detect")
async def detect_image(file: UploadFile = File(...)):
    try:
        # Load models if not already loaded
        load_models()
        print("Starting image detection process...")
        
        # Read and convert image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        print(f"Image loaded successfully: {image.size}")
        
        # Process with MobileNet model
        print("Preprocessing image for MobileNet...")
        # Resize image to match training size
        mobilenet_img = image.resize((IMG_SIZE, IMG_SIZE))
        print(f"Image resized to: {mobilenet_img.size}")
        
        # Convert to array and preprocess
        mobilenet_img = np.array(mobilenet_img)
        mobilenet_img = np.expand_dims(mobilenet_img, axis=0)
        mobilenet_img = preprocess_input(mobilenet_img)
        print(f"Image preprocessed, shape: {mobilenet_img.shape}")
        
        # Get MobileNet predictions
        print("Running MobileNet prediction...")
        mobilenet_predictions = mobilenet_model.predict(
            mobilenet_img,
            verbose=0
        )[0]
        
        print(f"Raw predictions: {mobilenet_predictions}")
        
        # Get the predicted class index and confidence
        mobilenet_class_id = np.argmax(mobilenet_predictions)
        mobilenet_confidence = float(mobilenet_predictions[mobilenet_class_id]) * 100
        
        # Get class name from index
        mobilenet_class_name = class_names.get(
            mobilenet_class_id, 
            f"Unknown class index: {mobilenet_class_id}"
        )
        
        print(f"Detected class: {mobilenet_class_name}")
        print(f"Confidence: {mobilenet_confidence:.2f}%")
        
        # Create empty YOLO detections to maintain frontend compatibility
        yolo_detections = []
        
        # Prepare result
        combined_result = {
            "yolo_detections": yolo_detections,
            "mobilenet_classification": {
                "class_id": int(mobilenet_class_id),
                "class_name": mobilenet_class_name,
                "confidence": mobilenet_confidence / 100  # Convert back to 0-1 range for frontend
            }
        }
        
        print(f"Returning result: {combined_result}")
        return JSONResponse(content=combined_result)
    
    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        print(f"Error processing image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error processing image"
        )


# Server startup configuration
if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", "4000"))
    host = "0.0.0.0"
    
    if os.getenv("ENV") == "production":
        # Production mode
        logging.info(f"Starting production server on port {port}")
        print(f"Starting production server on port {port}")
    else:
        # Development mode
        port = int(os.getenv("PORT", "4000"))
        logging.info(f"Starting development server on port {port}")
        print(f"Starting development server on port {port}")
        # In development, we can pass app directly
        uvicorn.run(app, host="127.0.0.1", port=port)
