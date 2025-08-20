from fastapi import APIRouter, UploadFile, File
from inference_sdk import InferenceHTTPClient
import os

router = APIRouter()

@router.post("/run-roboflow")
async def run_roboflow(image: UploadFile = File(...)):
    # Save the uploaded image to disk
    file_location = f"temp_{image.filename}"
    with open(file_location, "wb") as f:
        f.write(await image.read())

    # Run Roboflow workflow
    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com", api_key="2y1YRqRG1tRC10bI793g"
    )
    result = client.run_workflow(
        workspace_name="car-damage-detection-x0kvp",
        workflow_id="detect-count-and-visualize",
        images={"image": file_location},
        use_cache=True,
    )

    # Optionally, delete the temp file after use
    try:
        os.remove(file_location)
    except Exception:
        pass

    # Extract only damaged parts (exclude 'Undamaged')
    damaged_parts = []
    try:
        for prediction in result[0]["predictions"]["predictions"]:
            damage_class = prediction["class"]
            if "Undamaged" not in damage_class:
                damaged_parts.append(damage_class)
    except Exception:
        pass

    # Save damaged_parts to JSON file for cost estimation
    import json
    json_path = os.path.join(os.path.dirname(__file__), '../../../part_damage_result.json')
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({"damaged_parts": damaged_parts}, f)
        print(f"[DEBUG] part_damage_result.json written at: {json_path} with damaged_parts: {damaged_parts}")
    except Exception as e:
        print(f"[DEBUG] Failed to write part_damage_result.json at: {json_path} with error: {e}")
    return {"damaged_parts": damaged_parts}
