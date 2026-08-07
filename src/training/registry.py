"""
=========================================================
AeroTwin V6

Model Registry

Contains all models used for:

1. Fast Benchmarking
2. Final Training

=========================================================
"""

from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor,
    HistGradientBoostingRegressor,
)

from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor
from xgboost import XGBRegressor

from src.utils.config import (
    RANDOM_STATE,
    BENCHMARK_ESTIMATORS,
    FINAL_ESTIMATORS,
    BENCHMARK_LEARNING_RATE,
    FINAL_LEARNING_RATE,
    MAX_DEPTH,
)


# ==========================================================
# FAST BENCHMARK MODELS
# ==========================================================

def get_benchmark_models():
    """
    Fast models used only for benchmarking.
    """

    return {

        "CatBoost": CatBoostRegressor(
            iterations=BENCHMARK_ESTIMATORS,
            learning_rate=BENCHMARK_LEARNING_RATE,
            depth=MAX_DEPTH,
            loss_function="RMSE",
            verbose=False,
            random_seed=RANDOM_STATE,
        ),

        "XGBoost": XGBRegressor(
            n_estimators=100,
            learning_rate=BENCHMARK_LEARNING_RATE,
            max_depth=MAX_DEPTH,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "LightGBM": LGBMRegressor(
            n_estimators=100,
            learning_rate=BENCHMARK_LEARNING_RATE,
            random_state=RANDOM_STATE,
            verbose=-1,
        ),

        "ExtraTrees": ExtraTreesRegressor(
            n_estimators=100,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "RandomForest": RandomForestRegressor(
            n_estimators=100,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "HistGradientBoosting": HistGradientBoostingRegressor(
            max_iter=100,
            learning_rate=BENCHMARK_LEARNING_RATE,
            max_depth=MAX_DEPTH,
            random_state=RANDOM_STATE,
        ),
    }


# ==========================================================
# FINAL TRAINING MODELS
# ==========================================================

def get_final_models():
    """
    High-quality models used after benchmarking.
    """

    return {

        "CatBoost": CatBoostRegressor(
            iterations=FINAL_ESTIMATORS,
            learning_rate=FINAL_LEARNING_RATE,
            depth=MAX_DEPTH,
            loss_function="RMSE",
            verbose=False,
            random_seed=RANDOM_STATE,
        ),

        "XGBoost": XGBRegressor(
            n_estimators=700,
            learning_rate=0.03,
            max_depth=MAX_DEPTH,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "LightGBM": LGBMRegressor(
            n_estimators=700,
            learning_rate=0.03,
            random_state=RANDOM_STATE,
            verbose=-1,
        ),

        "ExtraTrees": ExtraTreesRegressor(
           n_estimators=250,
           max_depth=20,
           min_samples_split=5,
           min_samples_leaf=2,
           max_features="sqrt",
           bootstrap=False,
           random_state=RANDOM_STATE,
           n_jobs=-1,
       ),

        "RandomForest": RandomForestRegressor(
            n_estimators=250,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features="sqrt",
            random_state=RANDOM_STATE,
            n_jobs=-1,
       ),

        "HistGradientBoosting": HistGradientBoostingRegressor(
            max_iter=700,
            learning_rate=0.03,
            max_depth=MAX_DEPTH,
            random_state=RANDOM_STATE,
        ),
    }


# ==========================================================
# HELPER
# ==========================================================

def get_model(model_name: str, final: bool = False):
    """
    Returns a single model by name.

    Parameters
    ----------
    model_name : str
        Name of the model.

    final : bool
        False -> Benchmark model
        True  -> Final model
    """

    models = (
        get_final_models()
        if final
        else get_benchmark_models()
    )

    if model_name not in models:
        raise ValueError(f"Unknown model: {model_name}")

    return models[model_name]