from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import io
from PIL import Image
from ultralytics import YOLO
import tensorflow as tf
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os  # Import os to access environment variables

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models (will be loaded on first request)
yolo_model = None
mobilenet_model = None

def load_models():
    global yolo_model, mobilenet_model
    try:
        if yolo_model is None:
            yolo_model = YOLO("models/yolo11n.pt")
        if mobilenet_model is None:
            mobilenet_model = tf.keras.models.load_model(
                "models/best_model_mobilenet.keras"
            )
    except Exception as e:
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
        
        # Read and convert image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert PIL image to numpy array for processing
        img_array = np.array(image)
        
        # Process with YOLO model
        yolo_results = yolo_model(
            img_array,
            conf=0.25,  # Increase confidence threshold
            max_det=5   # Limit detections
        )
        
        # Extract detection results
        yolo_detections = []
        for result in yolo_results:
            boxes = result.boxes.xyxy.cpu().numpy().tolist()
            confidences = result.boxes.conf.cpu().numpy().tolist()
            class_ids = result.boxes.cls.cpu().numpy().tolist()
            class_names = [result.names[int(c)] for c in class_ids]
            
            for i in range(len(boxes)):
                yolo_detections.append({
                    "box": boxes[i],
                    "confidence": confidences[i],
                    "class_id": class_ids[i],
                    "class_name": class_names[i]
                })
        
        # Process with MobileNet model
        mobilenet_img = image.resize((224, 224))
        mobilenet_img = np.array(mobilenet_img) / 255.0
        mobilenet_img = np.expand_dims(mobilenet_img, axis=0)
        
        # Get MobileNet predictions
        mobilenet_predictions = mobilenet_model.predict(
            mobilenet_img,
            verbose=0
        )[0]
        
        mobilenet_class_id = np.argmax(mobilenet_predictions)
        mobilenet_confidence = float(mobilenet_predictions[mobilenet_class_id])
        mobilenet_class_name = f"class_{mobilenet_class_id}"
        
        # Combine results from both models
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
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )

# For local development
if __name__ == "__main__":
    import uvicorn
    host_url = os.getenv("HOST_URL", "http://localhost:10000")  # Use HOST_URL from .env
    uvicorn.run(app, host=host_url.split("://")[1])  # Extract host without setting port
