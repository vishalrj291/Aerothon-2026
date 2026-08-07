"""
=========================================================
AeroTwin V6

Model Persistence

=========================================================
"""

from pathlib import Path
import json
import joblib

from src.utils.config import MODEL_DIR


def save_model(
    model,
    feature_columns,
    target_name,
    metadata=None,
):
    """
    Saves:
        model.pkl
        features.json
        metadata.json
    """

    target_dir = MODEL_DIR / target_name

    target_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    # -------------------------
    # Save Model
    # -------------------------

    joblib.dump(
        model,
        target_dir / "model.pkl",
    )

    # -------------------------
    # Save Feature List
    # -------------------------

    with open(
        target_dir / "features.json",
        "w",
    ) as f:

        json.dump(
            feature_columns,
            f,
            indent=4,
        )

    # -------------------------
    # Save Metadata
    # -------------------------

    metadata = metadata or {}

    metadata["target"] = target_name

    metadata["n_features"] = len(feature_columns)

    with open(
        target_dir / "metadata.json",
        "w",
    ) as f:

        json.dump(
            metadata,
            f,
            indent=4,
        )

    print(f"Saved model -> {target_dir}")


def load_model(target_name):

    target_dir = MODEL_DIR / target_name

    model = joblib.load(
        target_dir / "model.pkl"
    )

    with open(
        target_dir / "features.json",
        "r",
    ) as f:

        features = json.load(f)

    with open(
        target_dir / "metadata.json",
        "r",
    ) as f:

        metadata = json.load(f)

    return model, features, metadata