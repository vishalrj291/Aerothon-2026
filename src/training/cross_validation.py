"""
=========================================================
AeroTwin V6

Group Cross Validation

Uses EngineID to prevent data leakage.

=========================================================
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from sklearn.model_selection import GroupKFold

from .evaluator import benchmark_model


from src.utils.config import N_SPLITS


def group_cross_validation(
    model,
    df: pd.DataFrame,
    feature_columns: list[str],
    target_column: str,
    group_column: str = "EngineID",
):

    groups = df[group_column]

    X = df[feature_columns]

    y = df[target_column]

    cv = GroupKFold(
        n_splits=N_SPLITS
    )

    fold_results = []

    print("\n" + "=" * 60)
    print(f"Cross Validation : {target_column}")
    print("=" * 60)

    for fold, (train_idx, test_idx) in enumerate(
        cv.split(X, y, groups),
        start=1,
    ):

        print(f"Fold {fold}/{N_SPLITS}")

        X_train = X.iloc[train_idx]

        X_test = X.iloc[test_idx]

        y_train = y.iloc[train_idx]

        y_test = y.iloc[test_idx]

        metrics, _ = benchmark_model(
            model,
            X_train,
            y_train,
            X_test,
            y_test,
        )

        metrics["Fold"] = fold

        fold_results.append(metrics)

    fold_results = pd.DataFrame(fold_results)

    summary = {

        "MAE": fold_results["MAE"].mean(),

        "RMSE": fold_results["RMSE"].mean(),

        "R2": fold_results["R2"].mean(),

        "MAPE": fold_results["MAPE"].mean(),

        "TrainingTime_sec":
            fold_results["TrainingTime_sec"].mean(),

        "InferenceTime_sec":
            fold_results["InferenceTime_sec"].mean(),

        "MAE_STD":
            fold_results["MAE"].std(),

        "RMSE_STD":
            fold_results["RMSE"].std(),

        "R2_STD":
            fold_results["R2"].std()

    }

    return summary, fold_results