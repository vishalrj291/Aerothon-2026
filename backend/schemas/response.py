"""
Prediction Response
"""

from pydantic import BaseModel


class PredictionResponse(BaseModel):

    CompressorHealth: float
    CompressorHealth_Confidence: float

    CombustorHealth: float
    CombustorHealth_Confidence: float

    TurbineHealth: float
    TurbineHealth_Confidence: float

    OverallHealth: float
    OverallHealth_Confidence: float

    Thrust_N: float
    Thrust_N_Confidence: float

    TSFC_g_N_s: float
    TSFC_g_N_s_Confidence: float