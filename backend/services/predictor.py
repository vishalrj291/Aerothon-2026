"""
=========================================================
AeroTwin V6

Prediction Service

Used By:
    • FastAPI
    • React Dashboard
    • Future RUL Module
    • Future Explainability Module

=========================================================
"""

import pandas as pd
from sklearn.ensemble import ExtraTreesRegressor

from backend.core.startup import MODEL_REGISTRY
from backend.core.validation import validate_ranges

from src.feature_engineering import add_physics_features
from src.inference.validator import validate_dataframe

from src.digital_twin.confidence import (
    extratrees_confidence,
    default_confidence,
)


# ==========================================================
# Predict One Target
# ==========================================================

def predict_target(
    feature_df: pd.DataFrame,
    target: str,
):

    registry = MODEL_REGISTRY[target]

    model = registry["model"]

    feature_columns = registry["features"]

    X = feature_df[feature_columns]

    # ------------------------------------------
    # ExtraTrees Confidence
    # ------------------------------------------

    if isinstance(model, ExtraTreesRegressor):

        prediction, confidence = extratrees_confidence(
            model,
            X,
        )

    # ------------------------------------------
    # Other Models
    # ------------------------------------------

    else:

        prediction, confidence = default_confidence(
            model,
            X,
        )

    return prediction, confidence


# ==========================================================
# Predict DataFrame
# ==========================================================

def predict_dataframe(
    df: pd.DataFrame,
):

    """
    Predict every row in a dataframe.
    """

    # ------------------------------------------
    # Required Columns Validation
    # ------------------------------------------

    validate_dataframe(df)

    # ------------------------------------------
    # Dataset Range Validation
    # ------------------------------------------

    for _, row in df.iterrows():

        validate_ranges(row.to_dict())

    # ------------------------------------------
    # Feature Engineering
    # ------------------------------------------

    feature_df = add_physics_features(
        df.copy()
    )

    result = df.copy()

    # ------------------------------------------
    # Predict Every Target
    # ------------------------------------------

    for target in MODEL_REGISTRY:

        prediction, confidence = predict_target(
            feature_df,
            target,
        )

        result[target] = prediction

        result[f"{target}_Confidence"] = confidence

    return result


# ==========================================================
# Predict Single Engine State
# ==========================================================

def predict_single(
    data: dict,
):

    """
    Predict one engine state.
    """

    validate_ranges(data)

    df = pd.DataFrame([data])

    result = predict_dataframe(df)

    return result.iloc[0].to_dict()


# ==========================================================
# Predict CSV
# ==========================================================

def predict_csv(
    df: pd.DataFrame,
):

    """
    Predict uploaded CSV.
    """

    result = predict_dataframe(df)

    return result.to_dict(
        orient="records"
    )