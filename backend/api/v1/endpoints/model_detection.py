from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

router = APIRouter()

# --- Parameters (match notebook) ---
DATA_DIR = os.path.join(os.path.dirname(__file__), '../../../Model_detection/car_dataset')
IMG_HEIGHT, IMG_WIDTH = 224, 224
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../../Model_detection/model/car_model_identifier.h5')

# --- Load model and class names once at startup ---
model = load_model(MODEL_PATH)
datagen_eval = ImageDataGenerator(rescale=1./255)
tmp = datagen_eval.flow_from_directory(
    os.path.join(DATA_DIR, 'train'),
    target_size=(IMG_HEIGHT, IMG_WIDTH))
class_names = list(tmp.class_indices.keys())

def predict_car(img_path):
    # Load and preprocess image
    img = image.load_img(img_path, target_size=(IMG_HEIGHT, IMG_WIDTH))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    prediction = model.predict(img_array)[0]
    predicted_class = class_names[np.argmax(prediction)]
    confidence = float(np.max(prediction) * 100)
    return predicted_class, confidence

@router.post("/")
async def detect_model(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    try:
        car_model, confidence = predict_car(file_location)
    except Exception as e:
        os.remove(file_location)
        return JSONResponse(content={"error": str(e)}, status_code=500)
    os.remove(file_location)
    # Save car_model to JSON file for cost estimation
    import json
    json_path = os.path.join(os.path.dirname(__file__), '../../../model_detection_result.json')
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({"car_model": car_model}, f)
        print(f"[DEBUG] model_detection_result.json written at: {json_path} with car_model: {car_model}")
    except Exception as e:
        print(f"[DEBUG] Failed to write model_detection_result.json at: {json_path} with error: {e}")
    return JSONResponse(content={"car_model": car_model, "confidence": confidence})
