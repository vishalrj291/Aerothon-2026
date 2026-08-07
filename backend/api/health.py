"""
Health API
"""

from fastapi import APIRouter

from backend.core.startup import MODEL_REGISTRY

router = APIRouter(
    tags=["Health"]
)


@router.get("/health")
def health():

    return {

        "status": "healthy",

        "models_loaded": len(MODEL_REGISTRY),

        "loaded_models": list(MODEL_REGISTRY.keys())

    }