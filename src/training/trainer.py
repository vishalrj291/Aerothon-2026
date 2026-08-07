"""
=========================================================
AeroTwin V6

Automatic Trainer

Uses the best model selected during benchmarking.

=========================================================
"""

from .registry import get_final_models
from .splitter import group_train_test_split
from .evaluator import benchmark_model
from .save_load import save_model


def train_best_model(
    df,
    feature_columns,
    target_column,
    best_model_name,
):
    """
    Train the best model for a target and save it.
    """

    print("\n" + "=" * 70)
    print(f"TRAINING FINAL MODEL : {target_column}")
    print("=" * 70)

    # -----------------------------------------------------
    # Get Model
    # -----------------------------------------------------

    models = get_final_models()

    if best_model_name not in models:
        raise ValueError(
            f"Unknown model: {best_model_name}"
        )

    model = models[best_model_name]

    # -----------------------------------------------------
    # Split Data
    # -----------------------------------------------------

    (
        X_train,
        X_test,
        y_train,
        y_test,
        train_df,
        test_df,
    ) = group_train_test_split(
        df=df,
        feature_columns=feature_columns,
        target_column=target_column,
    )

    # -----------------------------------------------------
    # Evaluate
    # -----------------------------------------------------

    metrics, predictions = benchmark_model(
        model,
        X_train,
        y_train,
        X_test,
        y_test,
    )

    # -----------------------------------------------------
    # Train Final Model
    # -----------------------------------------------------

    model.fit(
        X_train,
        y_train,
    )

    # -----------------------------------------------------
    # Save Model
    # -----------------------------------------------------

    save_model(
        model=model,
        feature_columns=feature_columns,
        target_name=target_column,
        metadata={
            "best_model": best_model_name,
            "R2": metrics["R2"],
            "RMSE": metrics["RMSE"],
            "MAE": metrics["MAE"],
            "MAPE": metrics["MAPE"],
        },
    )

    print(f"Model '{target_column}' trained successfully.")

    # -----------------------------------------------------
    # Return
    # -----------------------------------------------------

    return {
        "model": model,
        "metrics": metrics,
        "predictions": predictions,
        "train_df": train_df,
        "test_df": test_df,
    }