"""
=========================================================
AeroTwin V6

Input Validator

=========================================================
"""

from __future__ import annotations

import pandas as pd


REQUIRED_COLUMNS = [

    "EngineID",

    "Cycle",

    "Altitude_m",

    "Mach",

    "Tamb_K",

    "Pamb_Pa",

    "RPM_rev_min",

    "FuelFlow_kg_s",

    "P2_Pa",

    "T2_K",

    "P3_Pa",

    "T3_K",

    "P4_Pa",

    "T4_K"

]


def validate_dataframe(df: pd.DataFrame):

    missing = [

        col

        for col in REQUIRED_COLUMNS

        if col not in df.columns

    ]

    if missing:

        raise ValueError(

            f"Missing Columns: {missing}"

        )

    if df.empty:

        raise ValueError(

            "Input dataframe is empty."

        )

    return True