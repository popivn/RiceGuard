from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import io
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.imagenet_utils import preprocess_input
from fastapi.responses import JSONResponse
import os
from pathlib import Path
import logging
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the directory containing the current file
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables - use os.environ directly instead of dotenv for production
PORT = int(os.environ.get("PORT", "4000"))
APP_URL = os.environ.get("APP_URL", "")
ENV = os.environ.get("ENV", "development")

logger.info(f"PORT: {PORT}")
logger.info(f"APP_URL: {APP_URL}")
logger.info(f"Environment: {ENV}")

app = FastAPI()

# Configure CORS - simplified since both environments use the same config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models
mobilenet_model = None
yolo_model = None

# Image size for model input
IMG_SIZE = 224

# Class indices
class_names = {
    0: 'black spot',
    1: 'greening',
    2: 'healthy',
    3: 'scab',
    4: 'thrips'
}

# Load models only once using LRU cache
@lru_cache(maxsize=1)
def get_mobilenet_model():
    model_path = BASE_DIR / "models" / "best_lemon.keras"
    logger.info(f"Loading MobileNet model from: {model_path}")
    
    if not model_path.exists():
        raise FileNotFoundError(f"MobileNet model not found at {model_path}")
    
    try:
        # Set memory growth to avoid OOM errors
        physical_devices = tf.config.list_physical_devices('GPU')
        if physical_devices:
            for device in physical_devices:
                tf.config.experimental.set_memory_growth(device, True)
        
        # Load model with optimization flags
        model = tf.keras.models.load_model(
            str(model_path),
            compile=False  # Faster loading when not training
        )
        # Optimize for inference
        model = tf.function(model, jit_compile=True)
        logger.info("MobileNet model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading MobileNet model: {str(e)}")
        raise

@lru_cache(maxsize=1)
def get_yolo_model():
    yolo_path = BASE_DIR / "models" / "best.pt"
    logger.info(f"Loading YOLO model from: {yolo_path}")
    
    if not yolo_path.exists():
        raise FileNotFoundError(f"YOLO model not found at {yolo_path}")
    
    try:
        # Import here to avoid loading if not needed
        from ultralytics import YOLO
        model = YOLO(str(yolo_path))
        logger.info("YOLO model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading YOLO model: {str(e)}")
        raise

# Preload models on startup
@app.on_event("startup")
async def startup_event():
    try:
        # Preload models in background
        get_mobilenet_model()
        get_yolo_model()
        logger.info("Models preloaded successfully")
    except Exception as e:
        logger.error(f"Failed to preload models: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Image Detection API"}

@app.post("/detect")
async def detect_image(file: UploadFile = File(...)):
    try:
        # Read image data
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Get models (cached)
        yolo_model = get_yolo_model()
        mobilenet_model = get_mobilenet_model()
        
        # Process with YOLO model for object detection
        # Use lower resolution for faster processing
        yolo_results = yolo_model(image, verbose=False)
        
        # Extract YOLO detections more efficiently
        yolo_detections = []
        for result in yolo_results:
            boxes = result.boxes
            for i in range(len(boxes)):
                x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                conf = boxes.conf[i].item()
                cls = boxes.cls[i].item()
                class_name = result.names[int(cls)]
                
                yolo_detections.append({
                    "box": [float(x1), float(y1), float(x2), float(y2)],
                    "confidence": float(conf),
                    "class": int(cls),
                    "class_name": class_name
                })
        
        # Process with MobileNet model for disease classification
        # Resize image to match training size
        mobilenet_img = image.resize((IMG_SIZE, IMG_SIZE))
        
        # Convert to array and preprocess more efficiently
        mobilenet_img = np.array(mobilenet_img, dtype=np.float32)
        mobilenet_img = np.expand_dims(mobilenet_img, axis=0)
        mobilenet_img = preprocess_input(mobilenet_img)
        
        # Get MobileNet predictions with optimized batch size
        mobilenet_predictions = mobilenet_model(mobilenet_img, training=False).numpy()[0]
        
        # Get the predicted class index and confidence
        mobilenet_class_id = np.argmax(mobilenet_predictions)
        mobilenet_confidence = float(mobilenet_predictions[mobilenet_class_id])
        
        # Get class name from index
        mobilenet_class_name = class_names.get(
            mobilenet_class_id, 
            f"Unknown class index: {mobilenet_class_id}"
        )
        
        # Prepare result
        combined_result = {
            "yolo_detections": yolo_detections,
            "mobilenet_classification": {
                "class_id": int(mobilenet_class_id),
                "class_name": mobilenet_class_name,
                "confidence": mobilenet_confidence
            }
        }
        
        return JSONResponse(content=combined_result)
    
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )