from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import io
from PIL import Image
from ultralytics import YOLO
import tensorflow as tf
from fastapi.responses import JSONResponse

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
yolo_model = YOLO("app/models/yolo11n.pt")
mobilenet_model = tf.keras.models.load_model("app/models/best_model_mobilenet.keras")

# Optional: Define class names if available for MobileNet model
# mobilenet_classes = ["class1", "class2", "class3", "etc"]

@app.get("/")
async def root():
    return {"message": "Image Detection API"}

@app.post("/detect")
async def detect_image(file: UploadFile = File(...)):
    # Read and convert image
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    
    # Convert PIL image to numpy array for processing
    img_array = np.array(image)
    
    # Process with YOLO model
    yolo_results = yolo_model(img_array)
    
    # Extract detection results
    yolo_detections = []
    for result in yolo_results:
        boxes = result.boxes.xyxy.cpu().numpy().tolist()  # x1, y1, x2, y2
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
    # Preprocess image for MobileNet
    mobilenet_img = image.resize((224, 224))  # Adjust size according to model
    mobilenet_img = np.array(mobilenet_img) / 255.0  # Normalize
    mobilenet_img = np.expand_dims(mobilenet_img, axis=0)  # Add batch dimension
    
    # Get MobileNet predictions
    mobilenet_predictions = mobilenet_model.predict(mobilenet_img)[0]
    
    # Get the predicted class (assuming it's a classification model)
    mobilenet_class_id = np.argmax(mobilenet_predictions)
    mobilenet_confidence = float(mobilenet_predictions[mobilenet_class_id])
    
    # Optional: Get class name if available
    # mobilenet_class_name = mobilenet_classes[mobilenet_class_id] if mobilenet_classes else f"class_{mobilenet_class_id}"
    mobilenet_class_name = f"class_{mobilenet_class_id}"  # Use class names if available
    
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
