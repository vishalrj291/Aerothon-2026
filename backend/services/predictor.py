"""
=========================================================
AeroTwin V6

Prediction Service

• Physics Guided Prediction
• Confidence Estimation
• Health Prognostics
• Remaining Useful Life

=========================================================
"""

from __future__ import annotations

import pandas as pd
from sklearn.ensemble import ExtraTreesRegressor

from backend.core.startup import MODEL_REGISTRY
from backend.core.validation import validate_ranges

from backend.services.rul import (
    calculate_health_score,
    estimate_degradation,
    estimate_failure_cycle,
    estimate_rul,
    maintenance_risk,
    fleet_summary,
)

from src.feature_engineering import add_physics_features
from src.inference.validator import validate_dataframe

from src.digital_twin.confidence import (
    extratrees_confidence,
    default_confidence,
)

# ==========================================================
# Predict Single Target
# ==========================================================

def predict_target(
    feature_df: pd.DataFrame,
    target: str,
):

    registry = MODEL_REGISTRY[target]

    model = registry["model"]

    feature_columns = registry["features"]

    X = feature_df[feature_columns]

    if isinstance(model, ExtraTreesRegressor):

        prediction, confidence = extratrees_confidence(
            model,
            X,
        )

    else:

        prediction, confidence = default_confidence(
            model,
            X,
        )

    return prediction, confidence


# ==========================================================
# Predict Complete DataFrame
# ==========================================================

def predict_dataframe(
    df: pd.DataFrame,
):

    validate_dataframe(df)

    for _, row in df.iterrows():
        validate_ranges(row.to_dict())

    feature_df = add_physics_features(df.copy())

    result = df.copy()

    # ------------------------------------------------------
    # Predict all targets
    # ------------------------------------------------------

    for target in MODEL_REGISTRY:

        prediction, confidence = predict_target(
            feature_df,
            target,
        )

        result[target] = prediction

        result[f"{target}_Confidence"] = confidence

    # ------------------------------------------------------
    # Health Fusion
    # ------------------------------------------------------

    result["HealthScore"] = result.apply(
        calculate_health_score,
        axis=1,
    )

    # ------------------------------------------------------
    # RUL Analysis
    # ------------------------------------------------------

    result["EstimatedRUL"] = 0
    result["FailureCycle"] = 0
    result["HealthStatus"] = ""
    result["RiskLevel"] = ""
    result["Recommendation"] = ""

    for engine_id, engine_df in result.groupby("EngineID"):

        engine_df = engine_df.sort_values("Cycle")

        degradation = estimate_degradation(engine_df)

        current_row = engine_df.iloc[-1]

        current_cycle = int(current_row["Cycle"])

        current_health = float(current_row["HealthScore"])

        failure_cycle = estimate_failure_cycle(
            current_cycle,
            current_health,
            degradation,
        )

        rul = estimate_rul(
            current_cycle,
            failure_cycle,
        )

        risk = maintenance_risk(rul)

        result.loc[
            engine_df.index,
            "EstimatedRUL",
        ] = rul

        result.loc[
            engine_df.index,
            "FailureCycle",
        ] = failure_cycle

        result.loc[
            engine_df.index,
            "HealthStatus",
        ] = risk["status"]

        result.loc[
            engine_df.index,
            "RiskLevel",
        ] = risk["risk"]

        result.loc[
            engine_df.index,
            "Recommendation",
        ] = risk["recommendation"]

    summary = fleet_summary(result)

    return result, summary


# ==========================================================
# Predict Single Engine
# ==========================================================

def predict_single(
    data: dict,
):

    validate_ranges(data)

    df = pd.DataFrame([data])

    result, summary = predict_dataframe(df)

    return {

        "prediction": result.iloc[0].to_dict(),

        "summary": summary,

    }


# ==========================================================
# Predict CSV
# ==========================================================

def predict_csv(
    df: pd.DataFrame,
):

    result, summary = predict_dataframe(df)

    return {

        "summary": summary,

        "predictions": result.to_dict(
            orient="records"
        )

    }