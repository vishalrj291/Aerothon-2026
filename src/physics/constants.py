"""
=========================================================
AeroTwin V3
Physics Constants
=========================================================

Centralized physical constants used throughout the
Physics-Informed Digital Twin.

Units:
Temperature : Kelvin
Pressure    : Pascal
Energy      : Joule
Mass        : kg
Length      : m
Time        : s
"""

# =========================================================
# AIR PROPERTIES
# =========================================================

# Specific Heat at Constant Pressure (Dry Air)
CP_AIR = 1005.0           # J/kg-K

# Specific Heat at Constant Volume
CV_AIR = 718.0            # J/kg-K

# Ratio of Specific Heats
GAMMA = 1.4

# Gas Constant for Air
R_AIR = 287.0             # J/kg-K

# =========================================================
# AVIATION FUEL
# =========================================================

# Lower Heating Value (Jet-A / Kerosene Approximation)
LHV_FUEL = 43e6           # J/kg

# =========================================================
# ATMOSPHERIC CONSTANTS
# =========================================================

STANDARD_PRESSURE = 101325.0      # Pa
STANDARD_TEMPERATURE = 288.15     # K

# =========================================================
# MATHEMATICAL
# =========================================================

EPS = 1e-9

# =========================================================
# PHYSICAL LIMITS
# =========================================================

MIN_EFFICIENCY = 0.0
MAX_EFFICIENCY = 1.0

MIN_HEALTH = 0.0
MAX_HEALTH = 100.0