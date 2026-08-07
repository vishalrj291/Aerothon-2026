"""
=========================================================
AeroTwin V6

Dataset Derived Limits

=========================================================
"""

from pathlib import Path

import pandas as pd

DATASET_PATH = Path("dataset 2/full_dataset.csv")

LIMITS = {}


def load_limits():

    global LIMITS

    df = pd.read_csv(DATASET_PATH)

    # Remove target columns if present
    target_columns = [
        "CompressorHealth",
        "CombustorHealth",
        "TurbineHealth",
        "OverallHealth",
        "Thrust_N",
        "TSFC_g_N_s",
    ]

    df = df.drop(columns=target_columns, errors="ignore")

    limits = {}

    for column in df.columns:

        if pd.api.types.is_numeric_dtype(df[column]):

            minimum = float(df[column].min())
            maximum = float(df[column].max())

            span = maximum - minimum

            buffer = span * 0.05      # 5% tolerance

            limits[column] = {

                "min": minimum - buffer,

                "max": maximum + buffer,

            }

    LIMITS = limits

    print(f"Loaded limits for {len(LIMITS)} features.")