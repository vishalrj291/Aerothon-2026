"""
=========================================================
AeroTwin V3

Digital Twin Engine State

=========================================================
"""

from dataclasses import dataclass


@dataclass
class EngineState:

    # --------------------------
    # Ambient
    # --------------------------

    altitude: float = 0.0
    mach: float = 0.0

    Tamb: float = 0.0
    Pamb: float = 0.0

    # --------------------------
    # Inlet
    # --------------------------

    Tt: float = 0.0
    Pt: float = 0.0

    velocity: float = 0.0
    density: float = 0.0

    # --------------------------
    # Compressor
    # --------------------------

    compressor_pressure_ratio: float = 0.0
    compressor_temperature_ratio: float = 0.0

    compressor_work: float = 0.0

    compressor_efficiency: float = 0.0

    # --------------------------
    # Combustor
    # --------------------------

    combustor_pressure_loss: float = 0.0

    heat_added: float = 0.0

    combustion_efficiency: float = 0.0

    # --------------------------
    # Turbine
    # --------------------------

    turbine_work: float = 0.0

    turbine_efficiency: float = 0.0

    expansion_ratio: float = 0.0

    # --------------------------
    # Cycle
    # --------------------------

    thermal_efficiency: float = 0.0

    net_work: float = 0.0

    opr: float = 0.0

    # --------------------------
    # Health
    # --------------------------

    compressor_health: float = 100.0

    combustor_health: float = 100.0

    turbine_health: float = 100.0

    overall_health: float = 100.0

    # --------------------------
    # Prediction
    # --------------------------

    thrust: float = 0.0

    tsfc: float = 0.0

    rul: float = 100.0

    confidence: float = 100.0