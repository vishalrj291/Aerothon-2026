"""
=========================================================
AeroTwin V6

Health Prognostics Engine

Provides:

• Health Fusion
• Degradation Analysis
• Remaining Useful Life
• Maintenance Risk
• Fleet Summary

=========================================================
"""

from __future__ import annotations

import numpy as np
import pandas as pd

# ==========================================================
# CONFIGURATION
# ==========================================================

FAILURE_HEALTH = 70.0
MIN_DEGRADATION = 0.01

# ==========================================================
# HEALTH FUSION
# ==========================================================

def calculate_health_score(row):

    """
    Weighted engine health.
    """

    return (

        0.30 * row["CompressorHealth"] +

        0.25 * row["CombustorHealth"] +

        0.30 * row["TurbineHealth"] +

        0.15 * row["OverallHealth"]

    )

# ==========================================================
# DEGRADATION ESTIMATION
# ==========================================================

def estimate_degradation(engine_df: pd.DataFrame):

    """
    Estimate degradation trend
    using rolling-average smoothing.
    """

    df = engine_df.sort_values("Cycle").copy()

    if len(df) < 3:

        return MIN_DEGRADATION

    health = (

        df["HealthScore"]

        .rolling(

            window=min(5, len(df)),

            min_periods=1,

        )

        .mean()

    )

    slope, intercept = np.polyfit(

        df["Cycle"],

        health,

        1,

    )

    degradation = abs(float(slope))

    degradation = max(

        degradation,

        MIN_DEGRADATION,

    )

    return degradation

# ==========================================================
# FAILURE CYCLE
# ==========================================================

def estimate_failure_cycle(

    current_cycle,

    current_health,

    degradation,

):

    remaining_health = (

        current_health -

        FAILURE_HEALTH

    )

    if remaining_health <= 0:

        return current_cycle

    cycles_left = (

        remaining_health /

        degradation

    )

    return int(

        round(

            current_cycle +

            cycles_left

        )

    )

# ==========================================================
# RUL
# ==========================================================

def estimate_rul(

    current_cycle,

    failure_cycle,

):

    return max(

        failure_cycle -

        current_cycle,

        0,

    )

# ==========================================================
# RISK
# ==========================================================

def maintenance_risk(rul):

    if rul > 200:

        return {

            "status": "Excellent",

            "risk": "LOW",

            "color": "#22c55e",

            "recommendation":

                "Continue normal operation.",

        }

    if rul > 100:

        return {

            "status": "Healthy",

            "risk": "LOW",

            "color": "#84cc16",

            "recommendation":

                "Routine inspection recommended.",

        }

    if rul > 50:

        return {

            "status": "Warning",

            "risk": "MEDIUM",

            "color": "#eab308",

            "recommendation":

                "Schedule maintenance.",

        }

    if rul > 20:

        return {

            "status": "Critical",

            "risk": "HIGH",

            "color": "#f97316",

            "recommendation":

                "Immediate inspection required.",

        }

    return {

        "status": "Failure Imminent",

        "risk": "CRITICAL",

        "color": "#ef4444",

        "recommendation":

            "Remove engine from service.",

    }

# ==========================================================
# FLEET SUMMARY
# ==========================================================

def fleet_summary(result_df: pd.DataFrame):

    latest = (

        result_df

        .sort_values("Cycle")

        .groupby("EngineID")

        .tail(1)

    )

    return {

        "FleetHealth":

            round(

                latest["HealthScore"].mean(),

                2,

            ),

        "AverageRUL":

            int(

                latest["EstimatedRUL"].mean()

            ),

        "HealthyEngines":

            int(

                (

                    latest["RiskLevel"]

                    == "LOW"

                ).sum()

            ),

        "CriticalEngines":

            int(

                (

                    latest["RiskLevel"]

                    == "CRITICAL"

                ).sum()

            ),

        "TotalEngines":

            int(

                latest["EngineID"].nunique()

            ),

    }