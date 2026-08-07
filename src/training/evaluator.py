"""
=========================================================
AeroTwin V6

Model Evaluation Module

Author : AeroTwin Team

Computes all evaluation metrics required for
benchmarking and final model selection.

=========================================================
"""

from __future__ import annotations

import time
import numpy as np
import pandas as pd

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)


# ==========================================================
# RMSE
# ==========================================================

def rmse(y_true, y_pred):

    return np.sqrt(
        mean_squared_error(
            y_true,
            y_pred
        )
    )


# ==========================================================
# MAPE
# ==========================================================

def mape(
    y_true,
    y_pred,
    eps=1e-6
):

    y_true = np.asarray(y_true)

    y_pred = np.asarray(y_pred)

    return np.mean(

        np.abs(

            (y_true - y_pred)

            /

            (y_true + eps)

        )

    ) * 100


# ==========================================================
# Evaluate Predictions
# ==========================================================

def evaluate_predictions(
    y_true,
    y_pred
):

    results = {

        "MAE":

            mean_absolute_error(
                y_true,
                y_pred
            ),

        "RMSE":

            rmse(
                y_true,
                y_pred
            ),

        "R2":

            r2_score(
                y_true,
                y_pred
            ),

        "MAPE":

            mape(
                y_true,
                y_pred
            )

    }

    return results


# ==========================================================
# Benchmark One Model
# ==========================================================

def benchmark_model(
    model,
    X_train,
    y_train,
    X_test,
    y_test
):

    start = time.perf_counter()

    model.fit(
        X_train,
        y_train
    )

    training_time = (

        time.perf_counter()

        - start

    )

    start = time.perf_counter()

    predictions = model.predict(
        X_test
    )

    inference_time = (

        time.perf_counter()

        - start

    )

    metrics = evaluate_predictions(

        y_test,

        predictions

    )

    metrics["TrainingTime_sec"] = training_time

    metrics["InferenceTime_sec"] = inference_time

    return (

        metrics,

        predictions

    )


# ==========================================================
# Leaderboard
# ==========================================================

def create_leaderboard(
    results
):

    leaderboard = pd.DataFrame(
        results
    )

    leaderboard.sort_values(

        by="R2",

        ascending=False,

        inplace=True

    )

    leaderboard.reset_index(

        drop=True,

        inplace=True

    )

    return leaderboard


# ==========================================================
# Pretty Print
# ==========================================================

def print_metrics(metrics):

    print("\n")

    print("=" * 60)

    print("MODEL PERFORMANCE")

    print("=" * 60)

    for key, value in metrics.items():

        if isinstance(

            value,

            float

        ):

            print(

                f"{key:20s}: {value:.6f}"

            )

        else:

            print(

                f"{key:20s}: {value}"

            )

    print("=" * 60)