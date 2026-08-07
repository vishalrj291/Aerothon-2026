"""
=========================================================
AeroTwin V6

Prediction Engine

Usage

python predict.py --input "dataset 2/test.csv"

python predict.py --input hal_test.csv

python predict.py --input test.csv --output result.csv

=========================================================
"""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd
from sklearn.ensemble import ExtraTreesRegressor

from src.feature_engineering import add_physics_features
from src.training.save_load import load_model
from src.inference.validator import validate_dataframe
from src.digital_twin.confidence import (
    extratrees_confidence,
    default_confidence,
)
from src.utils.config import TARGET_COLUMNS


# ==========================================================
# Predict One Target
# ==========================================================

def predict_target(feature_df, target):

    model, feature_columns, metadata = load_model(target)

    X = feature_df[feature_columns]

    # -----------------------------------------
    # ExtraTrees → Real Confidence
    # -----------------------------------------

    if isinstance(model, ExtraTreesRegressor):

        prediction, confidence = extratrees_confidence(
            model,
            X,
        )

    # -----------------------------------------
    # Other Models
    # -----------------------------------------

    else:

        prediction, confidence = default_confidence(
            model,
            X,
        )

    return prediction, confidence


# ==========================================================
# Prediction Pipeline
# ==========================================================

def run_prediction(input_file, output_file):

    print("=" * 70)
    print("AEROTWIN PREDICTION ENGINE")
    print("=" * 70)

    print("\nLoading CSV...")

    # -----------------------------------------
    # Original Dataset
    # -----------------------------------------

    original_df = pd.read_csv(input_file)

    validate_dataframe(original_df)

    print("Input Validated")

    # -----------------------------------------
    # Feature Engineering
    # -----------------------------------------

    print("Generating Physics Features...")

    feature_df = add_physics_features(
        original_df.copy()
    )

    # -----------------------------------------
    # Keep original columns
    # -----------------------------------------

    result = original_df.copy()

    print()

    # -----------------------------------------
    # Predict every target
    # -----------------------------------------

    for target in TARGET_COLUMNS:

        print(f"Predicting {target}")

        prediction, confidence = predict_target(
            feature_df,
            target,
        )

        result[target] = prediction

        result[f"{target}_Confidence"] = confidence

    # -----------------------------------------
    # Save
    # -----------------------------------------

    output_path = Path(output_file)

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    result.to_csv(
        output_path,
        index=False,
    )

    print("\nPrediction Completed")

    print(f"Saved -> {output_path}")


# ==========================================================
# CLI
# ==========================================================

def parse_args():

    parser = argparse.ArgumentParser(
        description="AeroTwin Prediction Engine"
    )

    parser.add_argument(
        "--input",
        required=True,
        help="Input CSV",
    )

    parser.add_argument(
        "--output",
        default="predictions/prediction.csv",
        help="Output CSV",
    )

    return parser.parse_args()


# ==========================================================
# Main
# ==========================================================

def main():

    args = parse_args()

    run_prediction(
        args.input,
        args.output,
    )


# ==========================================================

if __name__ == "__main__":
    main()