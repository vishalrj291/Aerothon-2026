"""
=========================================================
AeroTwin V5
Production EDA Pipeline
=========================================================

Dataset:
dataset 2/turbojet_complete_dataset.csv

Author: AeroTwin Team
"""
from pathlib import Path
import warnings

import matplotlib
matplotlib.use("Agg")     # <-- IMPORTANT (must come BEFORE pyplot)

import matplotlib.pyplot as plt

import numpy as np
import pandas as pd

from sklearn.feature_selection import VarianceThreshold
from sklearn.feature_selection import mutual_info_regression
from sklearn.ensemble import RandomForestRegressor

warnings.filterwarnings("ignore")

plt.style.use("ggplot")

# ==========================================================
# PATHS
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = BASE_DIR / "dataset 2" / "turbojet_complete_dataset.csv"

REPORT_DIR = BASE_DIR / "reports"

FIGURE_DIR = BASE_DIR / "figures"

REPORT_DIR.mkdir(exist_ok=True)

FIGURE_DIR.mkdir(exist_ok=True)

# ==========================================================
# LOAD DATASET
# ==========================================================

def load_dataset():

    print("=" * 60)
    print("Loading Dataset...")
    print("=" * 60)

    df = pd.read_csv(DATASET_PATH)

    print(f"Rows    : {df.shape[0]}")
    print(f"Columns : {df.shape[1]}")

    return df

# ==========================================================
# DATASET SUMMARY
# ==========================================================

def dataset_summary(df):

    summary = {

        "Rows": len(df),

        "Columns": len(df.columns),

        "Memory_MB":
            round(
                df.memory_usage(deep=True).sum() /
                1024 /
                1024,
                2
            ),

        "DuplicateRows":
            df.duplicated().sum(),

        "MissingValues":
            int(df.isnull().sum().sum()),

        "UniqueEngines":
            df["EngineID"].nunique(),

        "UniqueCycles":
            df["Cycle"].nunique()

    }

    summary_df = pd.DataFrame(
        summary.items(),
        columns=["Metric", "Value"]
    )

    summary_df.to_csv(
        REPORT_DIR / "dataset_summary.csv",
        index=False
    )

    print("\n")
    print("=" * 60)
    print("DATASET SUMMARY")
    print("=" * 60)

    print(summary_df)

    return summary_df

# ==========================================================
# COLUMN SUMMARY
# ==========================================================

def column_summary(df):

    info = pd.DataFrame({

        "Column":
            df.columns,

        "Datatype":
            df.dtypes.astype(str),

        "Missing":
            df.isnull().sum().values,

        "Unique":
            df.nunique().values

    })

    info.to_csv(

        REPORT_DIR /
        "column_summary.csv",

        index=False

    )

    print("\nColumn Summary Saved.")

# ==========================================================
# ENGINE SUMMARY
# ==========================================================

def engine_summary(df):

    engine_stats = (
        df.groupby("EngineID")
        .agg(
            Samples=("EngineID", "count"),
            MinCycle=("Cycle", "min"),
            MaxCycle=("Cycle", "max"),
            AvgAltitude=("Altitude_m", "mean"),
            AvgRPM=("RPM_rev_min", "mean"),
            AvgFuelFlow=("FuelFlow_kg_s", "mean"),
            AvgThrust=("Thrust_N", "mean"),
            AvgTSFC=("TSFC_g_N_s", "mean"),
            AvgHealth=("OverallHealth", "mean")
        )
        .reset_index()
    )

    engine_stats.to_csv(
        REPORT_DIR / "engine_summary.csv",
        index=False
    )

    print("\n" + "="*60)
    print("ENGINE SUMMARY")
    print("="*60)

    print(engine_stats.head())

    print(f"\nTotal Engines : {len(engine_stats)}")

    return engine_stats

# ==========================================================
# TARGET SUMMARY
# ==========================================================

def target_summary(df):

    print("\n" + "=" * 60)
    print("TARGET SUMMARY")
    print("=" * 60)

    targets = [

        "CompressorHealth",
        "CombustorHealth",
        "TurbineHealth",
        "OverallHealth",
        "Thrust_N",
        "TSFC_g_N_s"

    ]

    summary = []

    for target in targets:

        values = df[target]

        summary.append({

            "Target": target,

            "Mean": values.mean(),

            "Median": values.median(),

            "Std": values.std(),

            "CV (%)": (
                 values.std() / values.mean() * 100
                 if values.mean() != 0
                 else np.nan
            ),

            "Min": values.min(),

            "Max": values.max(),

            "Range": values.max() - values.min(),

            "Skewness": values.skew(),

            "Kurtosis": values.kurt(),

            "UniqueValues": values.nunique()

        })

    summary_df = pd.DataFrame(summary)

    summary_df.to_csv(

        REPORT_DIR / "target_summary.csv",

        index=False

    )

    print(summary_df)

    return summary_df

# ==========================================================
# SENSOR SUMMARY
# ==========================================================

def sensor_summary(df):

    print("\n" + "=" * 60)
    print("SENSOR SUMMARY")
    print("=" * 60)

    sensors = [

        "Altitude_m",
        "Mach",
        "Tamb_K",
        "Pamb_Pa",
        "RPM_rev_min",
        "FuelFlow_kg_s",
        "P2_Pa",
        "T2_K",
        "P3_Pa",
        "T3_K",
        "P4_Pa",
        "T4_K"

    ]

    summary = []

    for sensor in sensors:

        values = df[sensor]

        summary.append({

            "Sensor": sensor,

            "Mean": values.mean(),

            "Median": values.median(),

            "Std": values.std(),

            "CV (%)": (
                values.std() / values.mean() * 100
                if values.mean() != 0
                else np.nan
            ),

            "Min": values.min(),

            "Max": values.max(),

            "Range": values.max() - values.min(),

            "Skewness": values.skew(),

            "Kurtosis": values.kurt(),

            "UniqueValues": values.nunique()

        })

    summary_df = pd.DataFrame(summary)

    summary_df.to_csv(

        REPORT_DIR / "sensor_summary.csv",

        index=False

    )

    print(summary_df)

    return summary_df

# ==========================================================
# CORRELATION ANALYSIS
# ==========================================================

def correlation_analysis(df):

    print("\n" + "=" * 60)
    print("CORRELATION ANALYSIS")
    print("=" * 60)

    sensor_columns = [

        "Altitude_m",
        "Mach",
        "Tamb_K",
        "Pamb_Pa",
        "RPM_rev_min",
        "FuelFlow_kg_s",
        "P2_Pa",
        "T2_K",
        "P3_Pa",
        "T3_K",
        "P4_Pa",
        "T4_K"

    ]

    target_columns = [

        "CompressorHealth",
        "CombustorHealth",
        "TurbineHealth",
        "OverallHealth",
        "Thrust_N",
        "TSFC_g_N_s"

    ]

    # ----------------------------------------
    # Sensor ↔ Sensor Correlation
    # ----------------------------------------

    sensor_corr = df[sensor_columns].corr()

    sensor_corr.to_csv(
        REPORT_DIR / "sensor_correlation.csv"
    )

    # ----------------------------------------
    # Sensor ↔ Target Correlation
    # ----------------------------------------

    target_corr = df[sensor_columns + target_columns].corr()

    target_corr.loc[
        sensor_columns,
        target_columns
    ].to_csv(
        REPORT_DIR / "sensor_target_correlation.csv"
    )

    # ----------------------------------------
    # Plot 1
    # ----------------------------------------

    plt.figure(figsize=(10,8))

    plt.imshow(sensor_corr, cmap="coolwarm")

    plt.colorbar()

    plt.xticks(
        range(len(sensor_columns)),
        sensor_columns,
        rotation=90
    )

    plt.yticks(
        range(len(sensor_columns)),
        sensor_columns
    )

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR /
        "sensor_correlation.png",
        dpi=300
    )

    plt.close()

    # ----------------------------------------
    # Plot 2
    # ----------------------------------------

    plt.figure(figsize=(8,8))

    plt.imshow(
        target_corr.loc[
            sensor_columns,
            target_columns
        ],
        cmap="coolwarm",
        aspect="auto"
    )

    plt.colorbar()

    plt.xticks(
        range(len(target_columns)),
        target_columns,
        rotation=45,
        ha="right"
    )

    plt.yticks(
        range(len(sensor_columns)),
        sensor_columns
    )

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR /
        "sensor_target_correlation.png",
        dpi=300
    )

    plt.close()

    print("Correlation Reports Saved.")

# ==========================================================
# PHYSICS VALIDATION
# ==========================================================

def physics_validation(df):

    print("\n" + "=" * 60)
    print("PHYSICS VALIDATION")
    print("=" * 60)

    rules = {

        "P2 > Pamb":
            (df["P2_Pa"] > df["Pamb_Pa"]),

        "P3 > P2":
            (df["P3_Pa"] > df["P2_Pa"]),

        "P4 < P3":
            (df["P4_Pa"] < df["P3_Pa"]),

        "T2 > Tamb":
            (df["T2_K"] > df["Tamb_K"]),

        "T3 > T2":
            (df["T3_K"] > df["T2_K"]),

        "T4 < T3":
            (df["T4_K"] < df["T3_K"]),

        "Fuel Flow > 0":
            (df["FuelFlow_kg_s"] > 0),

        "RPM > 0":
            (df["RPM_rev_min"] > 0),

        "Mach >= 0":
            (df["Mach"] >= 0),

        "Altitude >= 0":
            (df["Altitude_m"] >= 0)

    }

    results = []

    total_samples = len(df)

    for rule_name, condition in rules.items():

        passed = int(condition.sum())

        failed = total_samples - passed

        results.append({

            "Rule": rule_name,

            "Passed": passed,

            "Failed": failed,

            "Pass (%)": round(
                passed / total_samples * 100,
                2
            ),

            "Fail (%)": round(
                failed / total_samples * 100,
                2
            )

        })

    results_df = pd.DataFrame(results)

    results_df.to_csv(

        REPORT_DIR / "physics_validation.csv",

        index=False

    )

    print(results_df)

    overall_pass = results_df["Pass (%)"].mean()

    print("\nOverall Physics Consistency : "
          f"{overall_pass:.2f}%")

    return results_df
# ==========================================================
# DERIVED PHYSICS ANALYSIS
# ==========================================================

def derived_physics_analysis(df):

    df["Compressor_PR"] = df["P2_Pa"] / df["Pamb_Pa"]

    df["Combustor_PR"] = df["P3_Pa"] / df["P2_Pa"]

    df["Turbine_ER"] = df["P4_Pa"] / df["P3_Pa"]

    df["Compressor_TR"] = df["T2_K"] / df["Tamb_K"]

    df["Turbine_TR"] = df["T4_K"] / df["T3_K"]

    return df

# ==========================================================
# DERIVED PHYSICS SUMMARY
# ==========================================================

def derived_physics_summary(df):

    print("\n" + "=" * 60)
    print("DERIVED PHYSICS SUMMARY")
    print("=" * 60)

    features = [

        "Compressor_PR",
        "Combustor_PR",
        "Turbine_ER",
        "Compressor_TR",
        "Turbine_TR"

    ]

    summary = []

    for feature in features:

        values = df[feature]

        summary.append({

            "Feature": feature,

            "Mean": values.mean(),

            "Median": values.median(),

            "Std": values.std(),

            "Min": values.min(),

            "Max": values.max(),

            "Range": values.max() - values.min(),

            "Skewness": values.skew(),

            "Kurtosis": values.kurt(),

            "UniqueValues": values.nunique()

        })

    summary_df = pd.DataFrame(summary)

    summary_df.to_csv(

        REPORT_DIR / "derived_physics_summary.csv",

        index=False

    )

    print(summary_df)

    return summary_df

# ==========================================================
# FEATURE IMPORTANCE
# ==========================================================

def feature_importance_analysis(df):

    print("\n" + "=" * 60)
    print("FEATURE IMPORTANCE ANALYSIS")
    print("=" * 60)

    feature_columns = [

        "Altitude_m",
        "Mach",
        "Tamb_K",
        "Pamb_Pa",
        "RPM_rev_min",
        "FuelFlow_kg_s",
        "P2_Pa",
        "T2_K",
        "P3_Pa",
        "T3_K",
        "P4_Pa",
        "T4_K",

        "Compressor_PR",
        "Combustor_PR",
        "Turbine_ER",
        "Compressor_TR",
        "Turbine_TR"

    ]

    target_columns = [

        "CompressorHealth",
        "CombustorHealth",
        "TurbineHealth",
        "OverallHealth",
        "Thrust_N",
        "TSFC_g_N_s"

    ]

    X = df[feature_columns]

    for target in target_columns:

        print(f"\nProcessing {target}")

        y = df[target]

        # Pearson Correlation
        corr = X.corrwith(y)

        # Mutual Information
        mi = mutual_info_regression(
            X,
            y,
            random_state=42
        )

        # Random Forest
        rf = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        )

        rf.fit(X, y)

        importance = pd.DataFrame({

            "Feature": feature_columns,

            "Correlation": corr.values,

            "MutualInformation": mi,

            "RandomForestImportance": rf.feature_importances_

        })

        importance.sort_values(

            by="RandomForestImportance",

            ascending=False,

            inplace=True

        )

        importance.to_csv(

            REPORT_DIR /
            f"{target}_feature_importance.csv",

            index=False

        )

        print(importance.head(10))

# ==========================================================
# DATA QUALITY & LEAKAGE ANALYSIS
# ==========================================================

def data_quality_analysis(df):

    print("\n" + "=" * 60)
    print("DATA QUALITY ANALYSIS")
    print("=" * 60)

    feature_columns = [

        "Altitude_m",
        "Mach",
        "Tamb_K",
        "Pamb_Pa",
        "RPM_rev_min",
        "FuelFlow_kg_s",
        "P2_Pa",
        "T2_K",
        "P3_Pa",
        "T3_K",
        "P4_Pa",
        "T4_K",

        "Compressor_PR",
        "Combustor_PR",
        "Turbine_ER",
        "Compressor_TR",
        "Turbine_TR"

    ]

    X = df[feature_columns]

    report = []

    # =====================================================
    # Missing Values
    # =====================================================

    missing = X.isnull().sum().sum()

    report.append({

        "Check": "Missing Values",

        "Value": missing,

        "Status": "PASS" if missing == 0 else "FAIL"

    })

    # =====================================================
    # Duplicate Rows
    # =====================================================

    duplicates = X.duplicated().sum()

    report.append({

        "Check": "Duplicate Rows",

        "Value": duplicates,

        "Status": "PASS" if duplicates == 0 else "FAIL"

    })

    # =====================================================
    # Constant Features
    # =====================================================

    constant = X.columns[X.nunique() <= 1]

    report.append({

        "Check": "Constant Features",

        "Value": len(constant),

        "Status": "PASS" if len(constant) == 0 else "FAIL"

    })

    # =====================================================
    # Near Zero Variance
    # =====================================================

    selector = VarianceThreshold(threshold=1e-6)

    selector.fit(X)

    removed = len(feature_columns) - selector.get_support().sum()

    report.append({

        "Check": "Near Zero Variance",

        "Value": removed,

        "Status": "PASS" if removed == 0 else "WARNING"

    })

    # =====================================================
    # Highly Correlated Features
    # =====================================================

    corr = X.corr().abs()

    upper = corr.where(

        np.triu(np.ones(corr.shape), k=1).astype(bool)

    )

    high_corr = [

        column

        for column in upper.columns

        if any(upper[column] > 0.95)

    ]

    report.append({

        "Check": "Highly Correlated Features",

        "Value": len(high_corr),

        "Status": "WARNING" if len(high_corr) else "PASS"

    })

    report_df = pd.DataFrame(report)

    report_df.to_csv(

        REPORT_DIR /

        "data_quality_report.csv",

        index=False

    )

    print(report_df)

    if len(high_corr):

        pd.DataFrame({

            "HighlyCorrelatedFeatures": high_corr

        }).to_csv(

            REPORT_DIR /

            "highly_correlated_features.csv",

            index=False

        )

    print("\nData Quality Report Saved.")

    return report_df

# ==========================================================
# MAIN
# ==========================================================
def main():

    df = load_dataset()

    dataset_summary(df)

    column_summary(df)

    engine_summary(df)

    target_summary(df)

    sensor_summary(df)

    correlation_analysis(df)

    physics_validation(df)
    derived_physics_analysis(df)
    derived_physics_summary(df)
    feature_importance_analysis(df)
    data_quality_analysis(df)
    print("\nEDA PHASE 1 COMPLETED")
    print(df[[
    "Compressor_PR",
    "Combustor_PR",
    "Turbine_ER",
    "Compressor_TR",
    "Turbine_TR"
    ]].head())
    print("\n" + "=" * 60)
print("AEROTWIN DATASET READINESS")
print("=" * 60)
print("✓ Dataset Loaded")
print("✓ Dataset Summary Completed")
print("✓ Engine Analysis Completed")
print("✓ Target Analysis Completed")
print("✓ Sensor Analysis Completed")
print("✓ Correlation Analysis Completed")
print("✓ Physics Validation Completed")
print("✓ Derived Physics Features Created")
print("✓ Feature Importance Completed")
print("✓ Data Quality Report Generated")
print("\nSTATUS : READY FOR MODEL TRAINING")
print("=" * 60)
    

if __name__ == "__main__":

    main()