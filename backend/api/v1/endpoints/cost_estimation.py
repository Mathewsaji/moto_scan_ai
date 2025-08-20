
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import csv
import os
import json


# Store latest detected model and damaged parts in memory (for demo; use DB/cache for production)
# latest_detection = {"car_model": None, "damaged_parts": None}

class CostRequest(BaseModel):
    car_model: str
    damaged_parts: list


router = APIRouter()

# Store latest detected model and damaged parts in memory (for demo; use DB/cache for production)
latest_detection = {"car_model": None, "damaged_parts": None}

# @router.post("/set-latest-model/")
# async def set_latest_model(data: dict):
#     latest_detection["car_model"] = data.get("car_model")
#     return {"car_model": latest_detection["car_model"]}

# @router.post("/set-latest-damage/")
# async def set_latest_damage(data: dict):
#     latest_detection["damaged_parts"] = data.get("damaged_parts")
#     return {"damaged_parts": latest_detection["damaged_parts"]}

@router.post("/")
async def estimate_cost(request: Request):
    """Estimate the cost of car repairs based on the detected model and damaged parts."""
    # Read car model from model detection JSON file
    backend_dir = os.path.join(os.path.dirname(__file__).split('backend')[0], 'backend')
    model_json_path = os.path.join(backend_dir, 'model_detection_result.json')
    damage_json_path = os.path.join(backend_dir, 'part_damage_result.json')
    print(model_json_path)
    car_model = None
    damaged_parts = None
    try:
        with open(model_json_path, 'r', encoding='utf-8') as f:
            model_data = json.load(f)
            car_model = model_data.get('car_model', "Error")
    except Exception as e:
        print(f"[DEBUG] Could not read model_detection_result.json: {e}")
    try:
        with open(damage_json_path, 'r', encoding='utf-8') as f:
            damage_data = json.load(f)
            damaged_parts = damage_data.get('damaged_parts')
    except Exception as e:
        print(f"[DEBUG] Could not read part_damage_result.json: {e}")
    if not car_model or not damaged_parts:
        print(f"[DEBUG] Missing car_model or damaged_parts: car_model={car_model}, damaged_parts={damaged_parts}")
        return JSONResponse(content={"error": "car_model and damaged_parts must be available in JSON files."}, status_code=400)
    print(f"[DEBUG] car_model from JSON: {car_model}")
    print(f"[DEBUG] damaged_parts from JSON: {damaged_parts}")
    csv_path = os.path.join(backend_dir, 'pricing', 'parts_pricing.csv')
    total_cost = 0
    part_prices = {}
    try:
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(row for row in csvfile if not row.startswith('#'))
            for row in reader:
                if row['Car Model'] == car_model:
                    part_prices[row['Part Damage']] = int(row['Price'])
        print(f"[DEBUG] part_prices for {car_model}: {part_prices}")
        for part in damaged_parts:
            print(f"[DEBUG] Checking part: {part}, price: {part_prices.get(part)}")
            total_cost += part_prices.get(part, 0)
    except Exception as e:
        print(f"[DEBUG] Exception: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
    print(f"[DEBUG] Total estimated cost: {total_cost}")
    return JSONResponse(content={
        "car_model": car_model,
        "damaged_parts": damaged_parts,
        "estimated_cost": total_cost
    })
