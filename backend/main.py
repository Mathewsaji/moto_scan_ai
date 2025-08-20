from fastapi import FastAPI
from api.v1.endpoints import model_detection, part_damage_detection, cost_estimation

app = FastAPI()

app.include_router(model_detection.router, prefix="/model-detection", tags=["Model Detection"])
app.include_router(part_damage_detection.router, prefix="/part-damage-detection", tags=["Part Damage Detection"])
app.include_router(cost_estimation.router, prefix="/cost-estimation", tags=["Cost Estimation"])

@app.get("/")
def root():
    return {"message": "Vehicle Damage & Cost Estimation API"}
