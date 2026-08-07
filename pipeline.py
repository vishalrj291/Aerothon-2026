"""
=========================================================
AeroTwin V6

MASTER PIPELINE

Author : AeroTwin Team

Run:

python pipeline.py

=========================================================
"""

from __future__ import annotations

import time
import traceback

import pandas as pd

from src.feature_engineering import (
    add_physics_features,
    get_feature_columns,
)

from src.training.benchmark import benchmark_models
from src.training.trainer import train_best_model

from src.utils.generate_validation_limits import (
    generate_validation_limits,
)

from src.utils.config import (
    FULL_DATASET,
    TARGET_COLUMNS,
    BENCHMARK_REPORT,
)

# ==========================================================
# STAGE 1 : LOAD DATASET
# ==========================================================

def load_dataset():

    print("\n" + "=" * 70)
    print("STAGE 1 : LOAD DATASET")
    print("=" * 70)

    df = pd.read_csv(FULL_DATASET)

    print(f"Rows    : {len(df)}")
    print(f"Columns : {len(df.columns)}")

    return df


# ==========================================================
# STAGE 2 : GENERATE VALIDATION LIMITS
# ==========================================================

def build_validation_limits(df):

    print("\n" + "=" * 70)
    print("STAGE 2 : BUILD VALIDATION LIMITS")
    print("=" * 70)

    generate_validation_limits(
        df,
        "models/validation_limits.json",
    )

    print("Validation limits generated.")


# ==========================================================
# STAGE 3 : FEATURE ENGINEERING
# ==========================================================

def feature_engineering(df):

    print("\n" + "=" * 70)
    print("STAGE 3 : FEATURE ENGINEERING")
    print("=" * 70)

    df = add_physics_features(df)

    feature_columns = get_feature_columns(df)

    print(f"Final Features : {len(feature_columns)}")

    return df, feature_columns


# ==========================================================
# STAGE 4 : BENCHMARK + TRAIN
# ==========================================================

def benchmark_and_train(
    df,
    feature_columns,
):

    print("\n" + "=" * 70)
    print("STAGE 4 : MODEL TRAINING")
    print("=" * 70)

    summary = []

    for target in TARGET_COLUMNS:

        print("\n" + "=" * 70)
        print(f"TARGET : {target}")
        print("=" * 70)

        best_model_name, best_model, leaderboard = benchmark_models(

            df=df,

            feature_columns=feature_columns,

            target_column=target,

        )

        result = train_best_model(

            df=df,

            feature_columns=feature_columns,

            target_column=target,

            best_model_name=best_model_name,

        )

        leaderboard.to_csv(

            BENCHMARK_REPORT.parent /
            f"{target}_leaderboard.csv",

            index=False,

        )

        summary.append({

            "Target": target,

            "BestModel": best_model_name,

            "R2": result["metrics"]["R2"],

            "RMSE": result["metrics"]["RMSE"],

            "MAE": result["metrics"]["MAE"],

            "MAPE": result["metrics"]["MAPE"],

            "TrainingTime": result["metrics"]["TrainingTime_sec"],

            "InferenceTime": result["metrics"]["InferenceTime_sec"],

        })

    summary = pd.DataFrame(summary)

    summary.to_csv(

        BENCHMARK_REPORT,

        index=False,

    )

    return summary


# ==========================================================
# MAIN
# ==========================================================

def main():

    start = time.perf_counter()

    print("=" * 70)
    print("AEROTWIN V6")
    print("=" * 70)

    try:

        # Stage 1
        df = load_dataset()

        # Stage 2
        build_validation_limits(df)

        # Stage 3
        df, feature_columns = feature_engineering(df)

        # Stage 4
        summary = benchmark_and_train(

            df,

            feature_columns,

        )

        elapsed = time.perf_counter() - start

        print("\n" + "=" * 70)
        print("PIPELINE COMPLETED SUCCESSFULLY")
        print("=" * 70)

        print(summary)

        print(f"\nTotal Runtime : {elapsed:.2f} seconds")

    except Exception as e:

        print("\n" + "=" * 70)
        print("PIPELINE FAILED")
        print("=" * 70)

        print(e)

        traceback.print_exc()


# ==========================================================

if __name__ == "__main__":

    main()