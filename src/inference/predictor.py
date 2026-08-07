from pathlib import Path

import pandas as pd
from sklearn.ensemble import ExtraTreesRegressor
from src.inference.predictor import predict_dataframe
from src.feature_engineering import add_physics_features
from src.training.save_load import load_model
from src.inference.validator import validate_dataframe
from src.digital_twin.confidence import (
    extratrees_confidence,
    default_confidence,
)
from src.utils.config import TARGET_COLUMNS


def predict_target(feature_df, target):

    model, feature_columns, metadata = load_model(target)

    X = feature_df[feature_columns]

    if isinstance(model, ExtraTreesRegressor):

        prediction, confidence = extratrees_confidence(
            model,
            X,
        )

    else:

        prediction, confidence = default_confidence(
            model,
            X,
        )

    return prediction, confidence


def run_prediction(input_file, output_file):

    original_df = pd.read_csv(input_file)

    validate_dataframe(original_df)

    feature_df = add_physics_features(
        original_df.copy()
    )

    result = original_df.copy()

    for target in TARGET_COLUMNS:

        prediction, confidence = predict_target(
            feature_df,
            target,
        )

        result[target] = prediction

        result[f"{target}_Confidence"] = confidence

    output_path = Path(output_file)

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    result.to_csv(
        output_path,
        index=False,
    )

    return output_path