"""
=========================================================
AeroTwin V6

Global Configuration

Author : AeroTwin Team

=========================================================
"""

from pathlib import Path

# ==========================================================
# PROJECT ROOT
# ==========================================================

ROOT_DIR = Path(__file__).resolve().parents[2]

# ==========================================================
# DATA
# ==========================================================

DATA_DIR = ROOT_DIR / "dataset 2"

FULL_DATASET = DATA_DIR / "turbojet_complete_dataset.csv"

TRAIN_FILE = DATA_DIR / "train.csv"

TEST_FILE = DATA_DIR / "test.csv"

GROUND_TRUTH_FILE = DATA_DIR / "ground_truth.csv"

# ==========================================================
# OUTPUT DIRECTORIES
# ==========================================================

MODEL_DIR = ROOT_DIR / "models"

REPORT_DIR = ROOT_DIR / "reports"

FIGURE_DIR = ROOT_DIR / "figures"

PREDICTION_DIR = ROOT_DIR / "predictions"

LOG_DIR = ROOT_DIR / "logs"

# Create directories automatically
for directory in [

    MODEL_DIR,

    REPORT_DIR,

    FIGURE_DIR,

    PREDICTION_DIR,

    LOG_DIR

]:
    directory.mkdir(parents=True, exist_ok=True)

# ==========================================================
# RANDOMNESS
# ==========================================================

RANDOM_STATE = 42

# ==========================================================
# DATA SPLITTING
# ==========================================================

TEST_SIZE = 0.20

N_SPLITS = 5

GROUP_COLUMN = "EngineID"

# ==========================================================
# MODEL BENCHMARKING
# ==========================================================

BENCHMARK_ESTIMATORS = 50
FINAL_ESTIMATORS = 200
MAX_DEPTH = 6
BENCHMARK_LEARNING_RATE = 0.05

# ==========================================================
# FINAL MODEL TRAINING
# ==========================================================

FINAL_ESTIMATORS = 150

FINAL_LEARNING_RATE = 0.03

MAX_DEPTH = 6

# ==========================================================
# FEATURE ENGINEERING
# ==========================================================

EPS = 1e-6

GAMMA = 1.4

R_AIR = 287.05

CP_AIR = 1005.0

LHV_FUEL = 43e6

# ==========================================================
# TARGETS
# ==========================================================

TARGET_COLUMNS = [

    "CompressorHealth",

    "CombustorHealth",

    "TurbineHealth",

    "OverallHealth",

    "Thrust_N",

    "TSFC_g_N_s"

]

# ==========================================================
# FILE NAMES
# ==========================================================

BENCHMARK_REPORT = REPORT_DIR / "benchmark_summary.csv"

FEATURE_REPORT = REPORT_DIR / "feature_importance.csv"

PREDICTION_FILE = PREDICTION_DIR / "predictions.csv"

# ==========================================================
# LOGGING
# ==========================================================

LOG_LEVEL = "INFO"