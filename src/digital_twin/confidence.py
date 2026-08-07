"""
=========================================================
AeroTwin V6

Prediction Confidence

Computes confidence for model predictions.

=========================================================
"""

from __future__ import annotations

import numpy as np


def confidence_from_std(std: float) -> float:
    """
    Convert prediction standard deviation into confidence.

    Lower std  -> Higher confidence
    Higher std -> Lower confidence

    Returns:
        Confidence between 0 and 100
    """

    confidence = 100.0 / (1.0 + std)

    confidence = np.clip(confidence, 0.0, 100.0)

    return float(confidence)


def extratrees_confidence(model, X):
    """
    Estimate confidence using prediction agreement
    across all trees.

    Parameters
    ----------
    model : ExtraTreesRegressor
    X : pandas.DataFrame

    Returns
    -------
    prediction : ndarray
    confidence : ndarray
    """

    # Prediction from every tree
    tree_predictions = np.array(
        [tree.predict(X) for tree in model.estimators_]
    )

    # Mean prediction
    prediction = tree_predictions.mean(axis=0)

    # Standard deviation
    std = tree_predictions.std(axis=0)

    # Convert std -> confidence
    confidence = np.array(
        [confidence_from_std(s) for s in std]
    )

    return prediction, confidence


def default_confidence(model, X):
    """
    Fallback confidence for models that don't expose
    individual estimator predictions.

    Returns
    -------
    prediction : ndarray
    confidence : ndarray
    """

    prediction = model.predict(X)

    confidence = np.full(
        len(prediction),
        95.0,
        dtype=float,
    )

    return prediction, confidence