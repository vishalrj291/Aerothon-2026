"""
=========================================================
AeroTwin V6

Prediction API

=========================================================
"""

import io

import pandas as pd

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)

from backend.schemas.request import PredictionRequest

from backend.services.predictor import (
    predict_dataframe,
    predict_single,
)

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"],
)

# ==========================================================
# Predict CSV
# ==========================================================


@router.post("/csv")
async def predict_csv(
    file: UploadFile = File(...)
):

    try:

        if file.filename is None or not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported.",
            )

        contents = await file.read()

        df = pd.read_csv(
            io.BytesIO(contents)
        )

        result = predict_dataframe(df)

        return {
            "success": True,
            "rows": len(result),
            "predictions": result.to_dict(
                orient="records"
            ),
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )


# ==========================================================
# Predict Single Engine State
# ==========================================================


@router.post("/single")
async def single_prediction(
    request: PredictionRequest,
):

    try:

        result = predict_single(
            request.model_dump()
        )

        return {
            "success": True,
            "prediction": result,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )