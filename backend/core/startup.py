"""
=========================================================
AeroTwin V6

Startup Module

Loads all trained models and dataset-derived limits
into memory during API startup.

=========================================================
"""

from src.utils.config import TARGET_COLUMNS
from src.training.save_load import load_model

from backend.core.limits import load_limits

# ==========================================================
# Global Model Registry
# ==========================================================

MODEL_REGISTRY = {}


# ==========================================================
# Load Models
# ==========================================================

def load_models():

    global MODEL_REGISTRY

    MODEL_REGISTRY.clear()

    print()
    print("=" * 60)
    print("Loading Models")
    print("=" * 60)

    for target in TARGET_COLUMNS:

        model, feature_columns, metadata = load_model(target)

        MODEL_REGISTRY[target] = {

            "model": model,

            "features": feature_columns,

            "metadata": metadata,

        }

        print(f"✓ {target} Loaded")

    print()
    print(f"Loaded {len(MODEL_REGISTRY)} Models Successfully")


# ==========================================================
# Startup Initialization
# ==========================================================

def initialize():

    print()
    print("=" * 60)
    print("Initializing AeroTwin Backend")
    print("=" * 60)

    # Load trained ML models
    load_models()

    # Load dataset-derived validation limits
    load_limits()

    print()
    print("=" * 60)
    print("Backend Initialization Complete")
    print("=" * 60)