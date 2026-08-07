"""
=========================================================
AeroTwin V6

Group-Based Dataset Splitter

Author : AeroTwin Team

Purpose
-------
Splits the dataset using EngineID so that the same engine
never appears in both training and testing datasets.

This prevents data leakage and produces realistic
generalization performance.

=========================================================
"""

from __future__ import annotations

import pandas as pd
from sklearn.model_selection import GroupShuffleSplit

from src.utils.config import (
    RANDOM_STATE,
    TEST_SIZE,
    GROUP_COLUMN,
)


def group_train_test_split(
    df: pd.DataFrame,
    feature_columns: list[str],
    target_column: str,
    group_column: str = "EngineID",
    test_size: float = 0.20,
    random_state: int = RANDOM_STATE,
):
    """
    Performs a group-aware train/test split.

    Parameters
    ----------
    df : pd.DataFrame
        Complete dataset.

    feature_columns : list
        List of input feature names.

    target_column : str
        Target column.

    group_column : str
        Group identifier.
        Default = EngineID

    test_size : float
        Fraction of engines used for testing.

    random_state : int
        Random seed.

    Returns
    -------
    X_train
    X_test
    y_train
    y_test
    train_df
    test_df
    """

    # -----------------------------------------------------
    # Validation
    # -----------------------------------------------------

    if group_column not in df.columns:
        raise ValueError(
            f"'{group_column}' column not found."
        )

    if target_column not in df.columns:
        raise ValueError(
            f"'{target_column}' column not found."
        )

    missing_features = [
        feature
        for feature in feature_columns
        if feature not in df.columns
    ]

    if missing_features:
        raise ValueError(
            f"Missing features: {missing_features}"
        )

    # -----------------------------------------------------
    # Group Split
    # -----------------------------------------------------

    splitter = GroupShuffleSplit(
        n_splits=1,
        test_size=test_size,
        random_state=random_state,
    )

    groups = df[group_column]

    train_idx, test_idx = next(
        splitter.split(df, groups=groups)
    )

    train_df = df.iloc[train_idx].copy()

    test_df = df.iloc[test_idx].copy()

    # -----------------------------------------------------
    # Features & Targets
    # -----------------------------------------------------

    X_train = train_df[feature_columns]

    y_train = train_df[target_column]

    X_test = test_df[feature_columns]

    y_test = test_df[target_column]

    # -----------------------------------------------------
    # Leakage Check
    # -----------------------------------------------------

    train_engines = set(train_df[group_column])

    test_engines = set(test_df[group_column])

    overlap = train_engines.intersection(test_engines)

    if overlap:
        raise RuntimeError(
            "Engine leakage detected between "
            "training and testing datasets."
        )

    # -----------------------------------------------------
    # Summary
    # -----------------------------------------------------

    print("\n" + "=" * 60)
    print("GROUP TRAIN / TEST SPLIT")
    print("=" * 60)

    print(f"Target                : {target_column}")

    print(f"Training Engines      : {len(train_engines)}")

    print(f"Testing Engines       : {len(test_engines)}")

    print(f"Training Samples      : {len(train_df)}")

    print(f"Testing Samples       : {len(test_df)}")

    print(f"Number of Features    : {len(feature_columns)}")

    print("=" * 60)

    return (
        X_train,
        X_test,
        y_train,
        y_test,
        train_df,
        test_df,
    )


def get_groups(
    df: pd.DataFrame,
    group_column: str = "EngineID",
):
    """
    Returns EngineID groups for GroupKFold
    or other grouped validation strategies.
    """

    if group_column not in df.columns:
        raise ValueError(
            f"{group_column} not found."
        )

    return df[group_column]


def print_dataset_statistics(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    group_column: str = "EngineID",
):
    """
    Prints dataset statistics after splitting.
    """

    print("\n" + "=" * 60)
    print("DATASET STATISTICS")
    print("=" * 60)

    print(f"Train Shape : {train_df.shape}")

    print(f"Test Shape  : {test_df.shape}")

    print(f"Train Engines : {train_df[group_column].nunique()}")

    print(f"Test Engines  : {test_df[group_column].nunique()}")

    print("=" * 60)


if __name__ == "__main__":

    print(
        "AeroTwin Group Splitter Module\n"
        "Import this module inside benchmark.py "
        "or trainer.py."
    )