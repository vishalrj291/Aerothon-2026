"""
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

    return {

        "CatBoost": CatBoostRegressor(
            iterations=BENCHMARK_ESTIMATORS,
            learning_rate=BENCHMARK_LEARNING_RATE,
            depth=6,
            loss_function="RMSE",
            verbose=False,
            random_seed=RANDOM_STATE,
        ),

        "XGBoost": XGBRegressor(
            n_estimators=BENCHMARK_ESTIMATORS,
            learning_rate=BENCHMARK_LEARNING_RATE,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "LightGBM": LGBMRegressor(
            n_estimators=BENCHMARK_ESTIMATORS,
            learning_rate=BENCHMARK_LEARNING_RATE,
            max_depth=6,
            random_state=RANDOM_STATE,
            verbose=-1,
        ),

        "ExtraTrees": ExtraTreesRegressor(
            n_estimators=BENCHMARK_ESTIMATORS,
            max_depth=6,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features="sqrt",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "RandomForest": RandomForestRegressor(
            n_estimators=BENCHMARK_ESTIMATORS,
            max_depth=6,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features="sqrt",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "HistGradientBoosting": HistGradientBoostingRegressor(
            max_iter=BENCHMARK_ESTIMATORS,
            learning_rate=BENCHMARK_LEARNING_RATE,
            max_depth=6,
            random_state=RANDOM_STATE,
        ),
    }


# ==========================================================
# FINAL TRAINING MODELS
# ==========================================================

def get_final_models():

    return {

        "CatBoost": CatBoostRegressor(
            iterations=FINAL_ESTIMATORS,
            learning_rate=FINAL_LEARNING_RATE,
            depth=6,
            loss_function="RMSE",
            verbose=False,
            random_seed=RANDOM_STATE,
        ),

        "XGBoost": XGBRegressor(
            n_estimators=FINAL_ESTIMATORS,
            learning_rate=FINAL_LEARNING_RATE,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "LightGBM": LGBMRegressor(
            n_estimators=FINAL_ESTIMATORS,
            learning_rate=FINAL_LEARNING_RATE,
            max_depth=6,
            random_state=RANDOM_STATE,
            verbose=-1,
        ),

        "ExtraTrees": ExtraTreesRegressor(
            n_estimators=150,
            max_depth=6,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features="sqrt",
            bootstrap=False,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "RandomForest": RandomForestRegressor(
            n_estimators=150,
            max_depth=6,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features="sqrt",
            bootstrap=False,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "HistGradientBoosting": HistGradientBoostingRegressor(
            max_iter=FINAL_ESTIMATORS,
            learning_rate=FINAL_LEARNING_RATE,
            max_depth=6,
            random_state=RANDOM_STATE,
        ),
    }


# ==========================================================
# HELPER
# ==========================================================

def get_model(model_name: str, final: bool = False):

    models = (
        get_final_models()
        if final
        else get_benchmark_models()
    )

    if model_name not in models:
        raise ValueError(f"Unknown model: {model_name}")

    return models[model_name]