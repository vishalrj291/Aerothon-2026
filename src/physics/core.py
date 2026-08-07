"""
=========================================================
AeroTwin V3

Core Data Models

=========================================================
"""

from dataclasses import dataclass
from typing import Optional


# =========================================================
# RAW SENSOR DATA
# =========================================================

@dataclass(slots=True)
class SensorRecord:
    """
    Raw engine measurements.
    """

    altitude_m: float

    mach: float

    ambient_temperature_K: float

    ambient_pressure_Pa: float

    rpm: float

    fuel_flow_kg_s: float

    compressor_exit_pressure_Pa: float

    compressor_exit_temperature_K: float

    combustor_exit_pressure_Pa: float

    combustor_exit_temperature_K: float

    turbine_exit_pressure_Pa: float

    turbine_exit_temperature_K: float


# =========================================================
# PHYSICS STATE
# =========================================================

@dataclass(slots=True)
class PhysicsState:
    """
    Physics quantities computed by the Digital Twin.
    """

    # --------------------------
    # Atmosphere
    # --------------------------

    air_density: float = 0.0

    speed_of_sound: float = 0.0

    true_air_speed: float = 0.0

    dynamic_pressure: float = 0.0

    total_temperature: float = 0.0

    total_pressure: float = 0.0

    # --------------------------
    # Compressor
    # --------------------------

    compressor_pressure_ratio: float = 0.0

    compressor_temperature_ratio: float = 0.0

    compressor_specific_work: float = 0.0

    compressor_efficiency: float = 0.0

    compressor_loading: float = 0.0

    compressor_power_proxy: float = 0.0

    # --------------------------
    # Combustor
    # --------------------------

    combustor_pressure_loss: float = 0.0

    combustor_heat_added: float = 0.0

    combustion_efficiency: float = 0.0

    fuel_energy: float = 0.0

    # --------------------------
    # Turbine
    # --------------------------

    turbine_expansion_ratio: float = 0.0

    turbine_specific_work: float = 0.0

    turbine_efficiency: float = 0.0

    # --------------------------
    # Brayton Cycle
    # --------------------------

    overall_pressure_ratio: float = 0.0

    thermal_efficiency: float = 0.0

    net_specific_work: float = 0.0


# =========================================================
# FINAL PREDICTION
# =========================================================

@dataclass(slots=True)
class PredictionResult:
    """
    Final outputs produced by AeroTwin.
    """

    compressor_health: float = 0.0

    combustor_health: float = 0.0

    turbine_health: float = 0.0

    overall_health: float = 0.0

    thrust_N: float = 0.0

    tsfc: float = 0.0

    rul_percent: float = 0.0

    confidence: float = 0.0

    uncertainty: float = 0.0

    inference_time_ms: float = 0.0

    model_name: Optional[str] = None