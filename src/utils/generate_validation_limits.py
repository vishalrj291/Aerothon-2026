"""
=========================================================
AeroTwin V6

Generate Validation Limits

=========================================================
"""

import json
from pathlib import Path

import pandas as pd


SENSOR_COLUMNS = [
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
    "T4_K",
]


def generate_validation_limits(df, output_path):

    limits = {}

    for col in SENSOR_COLUMNS:

        values = df[col]

        q1 = values.quantile(0.01)
        q99 = values.quantile(0.99)

        span = q99 - q1

        limits[col] = {
            "min": float(q1 - 0.05 * span),
            "max": float(q99 + 0.05 * span),
            "dataset_min": float(values.min()),
            "dataset_max": float(values.max()),
            "mean": float(values.mean()),
            "std": float(values.std())
        }

    output_path = Path(output_path)

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(output_path, "w") as f:
        json.dump(
            limits,
            f,
            indent=4
        )

    print(f"Validation limits saved -> {output_path}")