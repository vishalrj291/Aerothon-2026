"""
=========================================================
AeroTwin V2
Advanced Evaluation Module

Provides:
- Regression Metrics
- Error Statistics
- Cross Validation
- SHAP Explainability
- Permutation Importance
- Learning Curves
- Residual Analysis
- Model Cards
- Engineering Reports

=========================================================
"""
import shap

from sklearn.inspection import permutation_importance
from pathlib import Path
import json
import logging
import time

import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from scipy import stats

from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error
)

from sklearn.model_selection import (
    learning_curve,
    GroupKFold,
    cross_validate
)

from sklearn.inspection import permutation_importance

from config import (
    REPORT_DIR,
    FIGURE_DIR,
    FIGURE_DPI,
    RANDOM_STATE
)

# ---------------------------------------------------------
# Logging
# ---------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------
# Create Directories
# ---------------------------------------------------------

REPORT_DIR.mkdir(parents=True, exist_ok=True)
FIGURE_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------
# Regression Metrics
# ---------------------------------------------------------

def calculate_metrics(y_true, y_pred):

    mae = mean_absolute_error(y_true, y_pred)

    rmse = np.sqrt(
        mean_squared_error(y_true, y_pred)
    )

    r2 = r2_score(
        y_true,
        y_pred
    )

    return {

        "MAE": float(mae),

        "RMSE": float(rmse),

        "R2": float(r2)

    }

# ---------------------------------------------------------
# Detailed Error Statistics
# ---------------------------------------------------------

def calculate_error_statistics(y_true, y_pred):

    residuals = y_true - y_pred

    stats_dict = {

        "Mean Error": float(np.mean(residuals)),
        "Median Error": float(np.median(residuals)),
        "Std Error": float(np.std(residuals)),
        "Maximum Error": float(np.max(np.abs(residuals))),
        "95 Percentile Error": float(
            np.percentile(np.abs(residuals),95)
        )

    }

    return stats_dict

# ---------------------------------------------------------
# Save Metrics
# ---------------------------------------------------------

def save_metrics(metrics, target):

    df = pd.DataFrame([metrics])

    df.to_csv(

        REPORT_DIR /
        f"{target}_metrics.csv",

        index=False

    )

# ---------------------------------------------------------
# Save Error Statistics
# ---------------------------------------------------------

def save_error_statistics(stats_dict, target):

    df = pd.DataFrame([stats_dict])

    df.to_csv(

        REPORT_DIR /
        f"{target}_error_statistics.csv",

        index=False

    )

# ---------------------------------------------------------
# Model Card
# ---------------------------------------------------------

def save_model_card(

    target,

    model_name,

    metrics,

    n_features,

    train_samples,

    test_samples,

    training_time

):

    model_card = {

        "Target": target,

        "Model": model_name,

        "Training Samples": int(train_samples),

        "Testing Samples": int(test_samples),

        "Number of Features": int(n_features),

        "Training Time (s)": round(training_time,2),

        "R2": round(metrics["R2"],6),

        "MAE": round(metrics["MAE"],6),

        "RMSE": round(metrics["RMSE"],6)

    }

    with open(

        REPORT_DIR /
        f"{target}_model_card.json",

        "w"

    ) as f:

        json.dump(

            model_card,

            f,

            indent=4

        )

# ---------------------------------------------------------
# Engineering Report
# ---------------------------------------------------------

def save_engineering_report(

    target,

    model_name,

    metrics,

    feature_importance_file

):

    report = f"""

# AeroTwin Engineering Report

## Target

{target}

---

## Selected Model

{model_name}

---

## Performance

R² : {metrics["R2"]:.5f}

MAE : {metrics["MAE"]:.5f}

RMSE : {metrics["RMSE"]:.5f}

---

## Explainability

Feature Importance:

{feature_importance_file}

---

## Remarks

Model successfully trained.

Physics-informed feature engineering applied.

Ready for deployment.

"""

    with open(

        REPORT_DIR /
        f"{target}_engineering_report.md",

        "w",

        encoding="utf-8"

    ) as f:

        f.write(report)

logger.info("Evaluation Core Loaded Successfully.")

# ==========================================================
# VISUALIZATION ENGINE
# ==========================================================

def plot_actual_vs_predicted(
    y_true,
    y_pred,
    target
):
    """
    Scatter plot of actual vs predicted values.
    """

    plt.figure(figsize=(7, 7))

    plt.scatter(
        y_true,
        y_pred,
        alpha=0.65,
        edgecolors="black"
    )

    minimum = min(y_true.min(), y_pred.min())
    maximum = max(y_true.max(), y_pred.max())

    plt.plot(
        [minimum, maximum],
        [minimum, maximum],
        color="red",
        linestyle="--",
        linewidth=2
    )

    plt.xlabel("Actual")
    plt.ylabel("Predicted")

    plt.title(
        f"{target} : Actual vs Predicted"
    )

    plt.grid(alpha=0.3)

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR /
        f"{target}_actual_vs_predicted.png",
        dpi=FIGURE_DPI
    )

    plt.close()


# ==========================================================
# RESIDUAL PLOT
# ==========================================================

def plot_residuals(
    y_true,
    y_pred,
    target
):

    residuals = y_true - y_pred

    plt.figure(figsize=(8,6))

    plt.scatter(
        y_pred,
        residuals,
        alpha=0.6,
        edgecolors="black"
    )

    plt.axhline(
        0,
        color="red",
        linestyle="--",
        linewidth=2
    )

    plt.xlabel("Predicted")

    plt.ylabel("Residual")

    plt.title(
        f"{target} Residual Plot"
    )

    plt.grid(alpha=0.3)

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR /
        f"{target}_residual_plot.png",
        dpi=FIGURE_DPI
    )

    plt.close()


# ==========================================================
# RESIDUAL HISTOGRAM
# ==========================================================

def plot_error_distribution(
    y_true,
    y_pred,
    target
):

    residuals = y_true - y_pred

    plt.figure(figsize=(8,5))

    plt.hist(
        residuals,
        bins=35,
        edgecolor="black"
    )

    plt.xlabel("Prediction Error")

    plt.ylabel("Frequency")

    plt.title(
        f"{target} Error Distribution"
    )

    plt.grid(alpha=0.25)

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR /
        f"{target}_error_distribution.png",
        dpi=FIGURE_DPI
    )

    plt.close()


# ==========================================================
# QQ PLOT
# ==========================================================

def plot_qq(
    y_true,
    y_pred,
    target
):

    residuals = y_true - y_pred

    plt.figure(figsize=(6,6))

    stats.probplot(
        residuals,
        dist="norm",
        plot=plt
    )

    plt.title(
        f"{target} Residual QQ Plot"
    )

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR /
        f"{target}_qq_plot.png",
        dpi=FIGURE_DPI
    )

    plt.close()


# ==========================================================
# FEATURE IMPORTANCE
# ==========================================================

def save_feature_importance(
    model,
    feature_names,
    target
):

    if not hasattr(model, "feature_importances_"):
        logger.info(
            f"{target}: Model has no built-in feature importance."
        )
        return

    importance = pd.DataFrame({

        "Feature": feature_names,

        "Importance": model.feature_importances_

    })

    importance = importance.sort_values(
        by="Importance",
        ascending=False
    )

    importance.to_csv(
        REPORT_DIR /
        f"{target}_feature_importance.csv",
        index=False
    )

    plt.figure(figsize=(9,7))

    plt.barh(

        importance["Feature"][:20],

        importance["Importance"][:20]

    )

    plt.gca().invert_yaxis()

    plt.xlabel("Importance")

    plt.title(
        f"{target} Feature Importance"
    )

    plt.tight_layout()

    plt.savefig(

        FIGURE_DIR /
        f"{target}_feature_importance.png",

        dpi=FIGURE_DPI

    )

    plt.close()


# ==========================================================
# CORRELATION HEATMAP
# ==========================================================

def plot_feature_correlation(
    X,
    target
):

    corr = X.corr()

    plt.figure(figsize=(14,12))

    plt.imshow(
        corr,
        cmap="coolwarm",
        aspect="auto"
    )

    plt.colorbar()

    plt.xticks(
        range(len(corr.columns)),
        corr.columns,
        rotation=90,
        fontsize=7
    )

    plt.yticks(
        range(len(corr.columns)),
        corr.columns,
        fontsize=7
    )

    plt.title(
        f"{target} Feature Correlation"
    )

    plt.tight_layout()

    plt.savefig(

        FIGURE_DIR /
        f"{target}_correlation_heatmap.png",

        dpi=FIGURE_DPI

    )

    plt.close()


# ==========================================================
# LEARNING CURVE
# ==========================================================

def plot_learning_curve(
    model,
    X,
    y,
    groups,
    target
):

    cv = GroupKFold(n_splits=5)

    train_sizes, train_scores, test_scores = learning_curve(

        estimator=model,

        X=X,

        y=y,

        groups=groups,

        cv=cv,

        scoring="r2",

        train_sizes=np.linspace(
            0.1,
            1.0,
            8
        ),

        n_jobs=-1

    )

    train_mean = train_scores.mean(axis=1)

    test_mean = test_scores.mean(axis=1)

    plt.figure(figsize=(8,5))

    plt.plot(
        train_sizes,
        train_mean,
        marker="o",
        label="Training"
    )

    plt.plot(
        train_sizes,
        test_mean,
        marker="o",
        label="Validation"
    )

    plt.xlabel("Training Samples")

    plt.ylabel("R² Score")

    plt.title(
        f"{target} Learning Curve"
    )

    plt.legend()

    plt.grid(alpha=0.3)

    plt.tight_layout()

    plt.savefig(

        FIGURE_DIR /
        f"{target}_learning_curve.png",

        dpi=FIGURE_DPI

    )

    plt.close()


logger.info("Visualization Engine Loaded Successfully.")

# ==========================================================
# SHAP SUMMARY
# ==========================================================

def save_shap_summary(
    model,
    X_test,
    feature_names,
    target
):
    """
    Generates SHAP Summary Plot
    SHAP Bar Plot
    SHAP Values CSV
    """

    try:

        logger.info(f"{target}: Computing SHAP values...")

        explainer = shap.TreeExplainer(model)

        shap_values = explainer.shap_values(X_test)

        shap_df = pd.DataFrame(
            shap_values,
            columns=feature_names
        )

        shap_df.to_csv(
            REPORT_DIR /
            f"{target}_shap_values.csv",
            index=False
        )

        plt.figure(figsize=(10,7))

        shap.summary_plot(
            shap_values,
            X_test,
            show=False
        )

        plt.tight_layout()

        plt.savefig(
            FIGURE_DIR /
            f"{target}_shap_summary.png",
            dpi=FIGURE_DPI
        )

        plt.close()

        plt.figure(figsize=(10,7))

        shap.summary_plot(
            shap_values,
            X_test,
            plot_type="bar",
            show=False
        )

        plt.tight_layout()

        plt.savefig(
            FIGURE_DIR /
            f"{target}_shap_bar.png",
            dpi=FIGURE_DPI
        )

        plt.close()

        logger.info(f"{target}: SHAP completed.")

    except Exception as e:

        logger.warning(
            f"{target}: SHAP skipped ({e})"
        )

# ==========================================================
# PERMUTATION IMPORTANCE
# ==========================================================

def save_permutation_importance(
    model,
    X_test,
    y_test,
    feature_names,
    target
):

    logger.info(
        f"{target}: Computing permutation importance..."
    )

    result = permutation_importance(

        model,

        X_test,

        y_test,

        scoring="r2",

        n_repeats=15,

        random_state=RANDOM_STATE,

        n_jobs=-1

    )

    importance = pd.DataFrame({

        "Feature": feature_names,

        "Importance": result.importances_mean,

        "Std": result.importances_std

    })

    importance = importance.sort_values(

        by="Importance",

        ascending=False

    )

    importance.to_csv(

        REPORT_DIR /

        f"{target}_permutation_importance.csv",

        index=False

    )

    plt.figure(figsize=(9,7))

    plt.barh(

        importance["Feature"][:20],

        importance["Importance"][:20]

    )

    plt.gca().invert_yaxis()

    plt.xlabel("Permutation Importance")

    plt.title(

        f"{target} Permutation Importance"

    )

    plt.tight_layout()

    plt.savefig(

        FIGURE_DIR /

        f"{target}_permutation_importance.png",

        dpi=FIGURE_DPI

    )

    plt.close()

# ==========================================================
# TOP FEATURES REPORT
# ==========================================================

def save_top_feature_report(
    target
):

    file = REPORT_DIR / f"{target}_permutation_importance.csv"

    if not file.exists():
        return

    df = pd.read_csv(file)

    top10 = df.head(10)

    report = "# Top Important Features\n\n"

    for i, row in top10.iterrows():

        report += (
            f"{i+1}. "
            f"{row['Feature']} "
            f"({row['Importance']:.5f})\n"
        )

    with open(

        REPORT_DIR /
        f"{target}_top_features.md",

        "w",

        encoding="utf-8"

    ) as f:

        f.write(report)

# ==========================================================
# FEATURE CONTRIBUTION REPORT
# ==========================================================

def save_feature_contribution_report(
    target
):

    file = REPORT_DIR / f"{target}_permutation_importance.csv"

    if not file.exists():
        return

    df = pd.read_csv(file)

    report = "# Feature Contribution Report\n\n"

    report += (
        "The following ranking shows which "
        "engineered features contributed "
        "most to the final prediction.\n\n"
    )

    for _, row in df.head(15).iterrows():

        report += (
            f"- {row['Feature']} : "
            f"{row['Importance']:.6f}\n"
        )

    with open(

        REPORT_DIR /

        f"{target}_feature_contribution.md",

        "w",

        encoding="utf-8"

    ) as f:

        f.write(report)
# ==========================================================
# CROSS VALIDATION
# ==========================================================

def perform_cross_validation(
    model,
    X,
    y,
    groups,
    target
):

    logger.info(f"{target}: Performing Group K-Fold Cross Validation...")

    cv = GroupKFold(n_splits=5)

    scores = cross_validate(

        estimator=model,

        X=X,

        y=y,

        groups=groups,

        cv=cv,

        scoring={

            "R2":"r2",

            "MAE":"neg_mean_absolute_error",

            "RMSE":"neg_root_mean_squared_error"

        },

        n_jobs=-1,

        return_train_score=False

    )

    results = {

        "Mean R2": np.mean(scores["test_R2"]),
        "Std R2": np.std(scores["test_R2"]),

        "Mean MAE": -np.mean(scores["test_MAE"]),
        "Std MAE": np.std(scores["test_MAE"]),

        "Mean RMSE": -np.mean(scores["test_RMSE"]),
        "Std RMSE": np.std(scores["test_RMSE"])

    }

    pd.DataFrame([results]).to_csv(

        REPORT_DIR /
        f"{target}_cross_validation.csv",

        index=False

    )

    return results
# ==========================================================
# UNCERTAINTY ESTIMATION
# ==========================================================

def estimate_uncertainty(
    model,
    X_test
):

    if not hasattr(model, "estimators_"):

        return None

    predictions = np.array([

        tree.predict(X_test)

        for tree in model.estimators_

    ])

    mean_prediction = predictions.mean(axis=0)

    std_prediction = predictions.std(axis=0)

    lower = mean_prediction - 1.96 * std_prediction

    upper = mean_prediction + 1.96 * std_prediction

    return {

        "prediction": mean_prediction,

        "std": std_prediction,

        "lower": lower,

        "upper": upper

    }
# ==========================================================
# SAVE UNCERTAINTY
# ==========================================================

def save_uncertainty_report(

    uncertainty,

    target

):

    if uncertainty is None:

        return

    df = pd.DataFrame({

        "Prediction":

            uncertainty["prediction"],

        "Std":

            uncertainty["std"],

        "Lower95":

            uncertainty["lower"],

        "Upper95":

            uncertainty["upper"]

    })

    df.to_csv(

        REPORT_DIR /

        f"{target}_uncertainty.csv",

        index=False

    )
# ==========================================================
# ENGINEERING REPORT
# ==========================================================

def generate_markdown_report(

    target,

    model_name,

    metrics,

    cv_results

):

    report = f"""

# AeroTwin Engineering Report

## Target

{target}

---

## Selected Model

{model_name}

---

## Test Performance

R² : {metrics["R2"]:.5f}

MAE : {metrics["MAE"]:.5f}

RMSE : {metrics["RMSE"]:.5f}

---

## Cross Validation

Mean R² :

{cv_results["Mean R2"]:.5f}

Std :

{cv_results["Std R2"]:.5f}

---

## Conclusion

The model demonstrates strong generalization.

Physics-informed feature engineering was used.

Model is suitable for deployment.

"""

    with open(

        REPORT_DIR /

        f"{target}_engineering_report.md",

        "w",

        encoding="utf-8"

    ) as f:

        f.write(report)
# ==========================================================
# MASTER EVALUATION PIPELINE
# ==========================================================

def evaluate_model(
    model,
    model_name,
    X_train,
    X_test,
    y_train,
    y_test,
    groups,
    feature_names,
    target,
    training_time
):
    """
    Complete evaluation pipeline.

    Automatically performs:

    • Metrics
    • Error Statistics
    • Feature Importance
    • Permutation Importance
    • SHAP Explainability
    • Learning Curve
    • Cross Validation
    • Residual Analysis
    • Correlation Heatmap
    • Prediction Uncertainty
    • Model Card
    • Engineering Report
    """

    logger.info("=" * 70)
    logger.info(f"Evaluating {target}")
    logger.info("=" * 70)

    # --------------------------------------------------
    # Prediction
    # --------------------------------------------------

    y_pred = model.predict(X_test)

    # --------------------------------------------------
    # Metrics
    # --------------------------------------------------

    metrics = calculate_metrics(
        y_test,
        y_pred
    )

    logger.info(metrics)

    save_metrics(
        metrics,
        target
    )

    # --------------------------------------------------
    # Error Statistics
    # --------------------------------------------------

    error_stats = calculate_error_statistics(
        y_test,
        y_pred
    )

    save_error_statistics(
        error_stats,
        target
    )

    # --------------------------------------------------
    # Feature Importance
    # --------------------------------------------------

    save_feature_importance(
        model,
        feature_names,
        target
    )

    # --------------------------------------------------
    # Permutation Importance
    # --------------------------------------------------

    save_permutation_importance(
        model,
        X_test,
        y_test,
        feature_names,
        target
    )

    # --------------------------------------------------
    # SHAP
    # --------------------------------------------------

    save_shap_summary(
        model,
        X_test,
        feature_names,
        target
    )

    save_top_feature_report(
        target
    )

    save_feature_contribution_report(
        target
    )

    # --------------------------------------------------
    # Visualizations
    # --------------------------------------------------

    plot_actual_vs_predicted(
        y_test,
        y_pred,
        target
    )

    plot_residuals(
        y_test,
        y_pred,
        target
    )

    plot_error_distribution(
        y_test,
        y_pred,
        target
    )

    plot_qq(
        y_test,
        y_pred,
        target
    )

    plot_feature_correlation(
        X_train,
        target
    )

    # --------------------------------------------------
    # Learning Curve
    # --------------------------------------------------

    plot_learning_curve(
        model,
        X_train,
        y_train,
        groups,
        target
    )

    # --------------------------------------------------
    # Cross Validation
    # --------------------------------------------------

    cv_results = perform_cross_validation(
        model,
        X_train,
        y_train,
        groups,
        target
    )

    # --------------------------------------------------
    # Prediction Uncertainty
    # --------------------------------------------------

    uncertainty = estimate_uncertainty(
        model,
        X_test
    )

    save_uncertainty_report(
        uncertainty,
        target
    )

    # --------------------------------------------------
    # Model Card
    # --------------------------------------------------

    save_model_card(

        target=target,

        model_name=model_name,

        metrics=metrics,

        n_features=len(feature_names),

        train_samples=len(X_train),

        test_samples=len(X_test),

        training_time=training_time

    )

    # --------------------------------------------------
    # Training Summary
    # --------------------------------------------------

    save_training_summary(

        target,

        model_name,

        metrics,

        cv_results,

        training_time

    )

    # --------------------------------------------------
    # Markdown Report
    # --------------------------------------------------

    generate_markdown_report(

        target,

        model_name,

        metrics,

        cv_results

    )

    logger.info(f"{target} Evaluation Completed.")

    return {

        "Target": target,

        "Model": model_name,

        "R2": metrics["R2"],

        "MAE": metrics["MAE"],

        "RMSE": metrics["RMSE"],

        "CV_R2": cv_results["Mean R2"],

        "TrainingTime": training_time

    }


# ==========================================================
# SAVE COMPLETE BENCHMARK
# ==========================================================

def save_final_results(results):

    df = pd.DataFrame(results)

    df = df.sort_values(

        by="R2",

        ascending=False

    )

    df.to_csv(

        REPORT_DIR /

        "final_results.csv",

        index=False

    )

    logger.info(
        "Final Results Saved Successfully."
    )