"""
=========================================================
AeroTwin V6

Benchmark Pipeline

Benchmarks every regression model using
GroupKFold Cross Validation.

=========================================================
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd


from .cross_validation import group_cross_validation


REPORT_DIR = Path("reports")
REPORT_DIR.mkdir(exist_ok=True)


def benchmark_models(
    df: pd.DataFrame,
    feature_columns: list[str],
    target_column: str,
):

    print("\n" + "=" * 70)
    print(f"BENCHMARKING TARGET : {target_column}")
    print("=" * 70)

    from .registry import get_benchmark_models

    models = get_benchmark_models()

    leaderboard = []

    best_model = None
    best_name = None
    best_r2 = float("-inf")

    for model_name, model in models.items():

        print(f"\nRunning {model_name}")

        summary, fold_results = group_cross_validation(

            model=model,

            df=df,

            feature_columns=feature_columns,

            target_column=target_column,

        )

        summary["Model"] = model_name

        leaderboard.append(summary)

        fold_results.to_csv(

            REPORT_DIR /

            f"{target_column}_{model_name}_folds.csv",

            index=False

        )

        if summary["R2"] > best_r2:

            best_r2 = summary["R2"]

            best_model = model

            best_name = model_name

    leaderboard = pd.DataFrame(leaderboard)

    leaderboard = leaderboard[

        [

            "Model",

            "R2",

            "RMSE",

            "MAE",

            "MAPE",

            "TrainingTime_sec",

            "InferenceTime_sec",

            "R2_STD",

            "RMSE_STD",

            "MAE_STD"

        ]

    ]

    leaderboard.sort_values(

        by="R2",

        ascending=False,

        inplace=True

    )

    leaderboard.reset_index(

        drop=True,

        inplace=True

    )

    leaderboard.to_csv(

        REPORT_DIR /

        f"{target_column}_benchmark.csv",

        index=False

    )

    print("\n")

    print("=" * 70)

    print("LEADERBOARD")

    print("=" * 70)

    print(leaderboard)

    print("\n")

    print(f"BEST MODEL : {best_name}")

    print(f"BEST R2    : {best_r2:.6f}")

    return (

        best_name,

        best_model,

        leaderboard

    )