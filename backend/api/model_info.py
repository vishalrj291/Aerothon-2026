"""
=========================================================
AeroTwin V6

Model Information API

=========================================================
"""

from fastapi import APIRouter

from backend.core.startup import MODEL_REGISTRY

router = APIRouter(
    tags=["Model Info"]
)


@router.get("/model-info")
def model_info():

    info = {}

    for target, registry in MODEL_REGISTRY.items():

        metadata = registry.get("metadata", {})

        info[target] = {

            "BestModel": metadata.get(
                "best_model",
                "Unknown",
            ),

            "R2": metadata.get(
                "R2",
                None,
            ),

            "RMSE": metadata.get(
                "RMSE",
                None,
            ),

            "MAE": metadata.get(
                "MAE",
                None,
            ),

            "MAPE": metadata.get(
                "MAPE",
                None,
            ),

            "FeatureCount": len(
                registry["features"]
            ),

        }

    return {

        "Project": "AeroTwin",

        "Version": "6.0",

        "PhysicsGuided": True,

        "Targets": len(MODEL_REGISTRY),

        "TargetNames": list(
            MODEL_REGISTRY.keys()
        ),

        "Models": info,

    }