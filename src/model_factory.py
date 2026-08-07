"""
=========================================================
AeroTwin V2
Model Factory

Creates all candidate models used during benchmarking.
=========================================================
"""

from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor,
)

from catboost import CatBoostRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

from config import RANDOM_STATE


def get_models():
    """
    Returns a dictionary containing all candidate models.
    """

    models = {

        "ExtraTrees": ExtraTreesRegressor(
            n_estimators=500,
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),

        "RandomForest": RandomForestRegressor(
            n_estimators=500,
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),

        "CatBoost": CatBoostRegressor(
            iterations=500,
            learning_rate=0.05,
            depth=6,
            loss_function="RMSE",
            random_seed=RANDOM_STATE,
            verbose=False
        ),

        "XGBoost": XGBRegressor(
            n_estimators=500,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),

        "LightGBM": LGBMRegressor(
            n_estimators=500,
            learning_rate=0.05,
            max_depth=-1,
            random_state=RANDOM_STATE,
            n_jobs=-1
        )

    }

    return models