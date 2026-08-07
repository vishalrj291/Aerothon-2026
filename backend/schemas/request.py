"""
Prediction Request Schema
"""

from pydantic import BaseModel


class PredictionRequest(BaseModel):

    EngineID: int
    Cycle: int

    Altitude_m: float
    Mach: float

    Tamb_K: float
    Pamb_Pa: float

    RPM_rev_min: float
    FuelFlow_kg_s: float

    P2_Pa: float
    T2_K: float

    P3_Pa: float
    T3_K: float

    P4_Pa: float
    T4_K: float