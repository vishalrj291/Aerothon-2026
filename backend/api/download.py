"""
=========================================================
AeroTwin V6

Download API

=========================================================
"""

from pathlib import Path

from fastapi import APIRouter
from fastapi import HTTPException
from fastapi.responses import FileResponse

router = APIRouter(
    tags=["Download"]
)

PREDICTION_FILE = Path(
    "predictions/prediction.csv"
)


@router.get("/download/latest")
def download_prediction():

    if not PREDICTION_FILE.exists():

        raise HTTPException(

            status_code=404,

            detail="Prediction file not found."

        )

    return FileResponse(

        path=PREDICTION_FILE,

        filename="AeroTwin_Prediction.csv",

        media_type="text/csv",

    )