"""
=========================================================
AeroTwin V6
Physics Guided Feature Engineering

Author : AeroTwin Team

This module is used during

✓ Training
✓ Validation
✓ Benchmarking
✓ Prediction
✓ HAL Final Evaluation

Target Leakage Prevention
-------------------------
EngineID:
    Used only for GroupShuffleSplit.

Cycle:
    Never used as ML feature.

Only sensor measurements are transformed into
physics-guided features.
=========================================================
"""

from __future__ import annotations

import warnings
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

# ==========================================================
# CONSTANTS
# ==========================================================

EPS = 1e-6

GAMMA = 1.4

R_AIR = 287.05

CP_AIR = 1005.0

LHV_FUEL = 43e6

# ==========================================================
# REQUIRED SENSOR COLUMNS
# ==========================================================

REQUIRED_COLUMNS = [

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

# ==========================================================
# DATASET VALIDATION
# ==========================================================

def validate_dataset(df: pd.DataFrame) -> None:

    missing = [

        column

        for column in REQUIRED_COLUMNS

        if column not in df.columns

    ]

    if missing:

        raise ValueError(

            f"Missing required columns: {missing}"

        )

# ==========================================================
# MAIN FEATURE ENGINEERING
# ==========================================================

def add_physics_features(

    df: pd.DataFrame

) -> pd.DataFrame:

    """
    Creates physics-guided features.

    Returns
    -------
    DataFrame
        ML-ready dataframe.
    """

    validate_dataset(df)

    df = df.copy()

    # ------------------------------------------------------
    # Remove Cycle
    # ------------------------------------------------------

    df.drop(

        columns=["Cycle"],

        inplace=True,

        errors="ignore"

    )

    # ------------------------------------------------------
    # ATMOSPHERIC FEATURES
    # ------------------------------------------------------

    df["AirDensity"] = (

        df["Pamb_Pa"]

        /

        (

            R_AIR *

            df["Tamb_K"]

            + EPS

        )

    )

    df["SpeedOfSound"] = np.sqrt(

        GAMMA *

        R_AIR *

        df["Tamb_K"]

    )

    df["TrueAirSpeed"] = (

        df["Mach"]

        *

        df["SpeedOfSound"]

    )

    df["DynamicPressure"] = (

        0.5 *

        df["AirDensity"]

        *

        df["TrueAirSpeed"] ** 2

    )

    df["TotalTemperature"] = (

        df["Tamb_K"]

        *

        (

            1 +

            (

                (GAMMA - 1)

                / 2

            )

            *

            df["Mach"] ** 2

        )

    )

    df["TotalPressure"] = (

        df["Pamb_Pa"]

        *

        (

            1 +

            (

                (GAMMA - 1)

                / 2

            )

            *

            df["Mach"] ** 2

        )

        **

        (

            GAMMA /

            (

                GAMMA - 1

            )

        )

    )
    # ------------------------------------------------------
    # COMPRESSOR PHYSICS
    # ------------------------------------------------------

    # Compressor Pressure Ratio
    df["Comp_PR"] = (
        df["P2_Pa"] /
        (df["TotalPressure"] + EPS)
    )

    # Compressor Temperature Ratio
    df["Comp_TR"] = (
        df["T2_K"] /
        (df["TotalTemperature"] + EPS)
    )

    # Temperature Rise
    df["Comp_TempRise"] = (
        df["T2_K"] -
        df["TotalTemperature"]
    )

    # Pressure Rise
    df["Comp_PressureRise"] = (
        df["P2_Pa"] -
        df["Pamb_Pa"]
    )

    # Compressor Work
    df["Comp_Work"] = (
        CP_AIR *
        df["Comp_TempRise"]
    )

    # Isentropic Outlet Temperature
    df["Comp_Isentropic_T2"] = (
        df["TotalTemperature"]
        *
        np.power(
            df["Comp_PR"],
            (GAMMA - 1) / GAMMA
        )
    )

    # Compressor Efficiency
    df["Comp_Efficiency"] = (
        (
            df["Comp_Isentropic_T2"]
            -
            df["TotalTemperature"]
        )
        /
        (
            df["Comp_TempRise"]
            +
            EPS
        )
    )

    # Compressor Loading
    df["Comp_Loading"] = (
        df["Comp_Work"]
        /
        (
            df["RPM_rev_min"]
            +
            EPS
        )
    )

    # Compressor Power Proxy
    df["Comp_PowerProxy"] = (
        df["Comp_Work"]
        *
        df["RPM_rev_min"]
    )

    # Compressor Energy Index
    df["Comp_EnergyIndex"] = (
        df["Comp_PR"]
        *
        df["RPM_rev_min"]
    )

    # Pressure Gain per Fuel
    df["PressureGainPerFuel"] = (
        df["Comp_PressureRise"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Temperature Rise per Fuel
    df["TempRisePerFuel"] = (
        df["Comp_TempRise"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Pressure Rise per RPM
    df["PressureRisePerRPM"] = (
        df["Comp_PressureRise"]
        /
        (
            df["RPM_rev_min"]
            +
            EPS
        )
    )

    # Work per Fuel
    df["Comp_WorkPerFuel"] = (
        df["Comp_Work"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Compressor Health Indicator
    df["Comp_HealthIndex"] = (
        df["Comp_PR"]
        *
        df["Comp_Efficiency"]
    )
    # ------------------------------------------------------
    # COMBUSTOR PHYSICS
    # ------------------------------------------------------

    # Pressure Loss across Combustor
    df["Comb_PressureLoss"] = (
        df["P2_Pa"] -
        df["P3_Pa"]
    )

    # Pressure Loss Ratio
    df["Comb_PressureLossRatio"] = (
        df["Comb_PressureLoss"]
        /
        (
            df["P2_Pa"]
            +
            EPS
        )
    )

    # Pressure Recovery
    df["Comb_PressureRecovery"] = (
        df["P3_Pa"]
        /
        (
            df["P2_Pa"]
            +
            EPS
        )
    )

    # Temperature Rise
    df["Comb_TemperatureRise"] = (
        df["T3_K"] -
        df["T2_K"]
    )

    # Heat Added
    df["Comb_HeatAdded"] = (
        CP_AIR *
        df["Comb_TemperatureRise"]
    )

    # Fuel Energy
    df["FuelEnergy"] = (
        df["FuelFlow_kg_s"]
        *
        LHV_FUEL
    )

    # Combustor Efficiency
    df["Comb_Efficiency"] = (
        df["Comb_HeatAdded"]
        /
        (
            df["FuelEnergy"]
            +
            EPS
        )
    )

    # Heat Added per Fuel
    df["HeatPerFuel"] = (
        df["Comb_HeatAdded"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Temperature Rise per Fuel
    df["Comb_TempRisePerFuel"] = (
        df["Comb_TemperatureRise"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Fuel Loading
    df["FuelLoading"] = (
        df["FuelFlow_kg_s"]
        *
        df["RPM_rev_min"]
    )

    # Fuel-Air Proxy
    df["FuelAirProxy"] = (
        df["FuelFlow_kg_s"]
        /
        (
            df["AirDensity"]
            *
            df["TrueAirSpeed"]
            +
            EPS
        )
    )

    # Combustor Thermal Loading
    df["Comb_ThermalLoading"] = (
        df["FuelFlow_kg_s"]
        *
        df["T3_K"]
    )

    # Heat Addition Index
    df["HeatAdditionIndex"] = (
        df["Comb_HeatAdded"]
        *
        df["Comb_Efficiency"]
    )

    # Flame Stability Proxy
    df["FlameStability"] = (
        df["Comb_TemperatureRise"]
        *
        df["Comb_PressureRecovery"]
    )

    # Combustor Energy Index
    df["Comb_EnergyIndex"] = (
        df["FuelEnergy"]
        *
        df["Comb_Efficiency"]
    )

    # Pressure Recovery Index
    df["PressureRecoveryIndex"] = (
        df["Comb_PressureRecovery"]
        *
        df["RPM_rev_min"]
    )

    # Heat Release Rate
    df["HeatReleaseRate"] = (
        df["Comb_HeatAdded"]
        *
        df["FuelFlow_kg_s"]
    )

    # Fuel Utilization Index
    df["FuelUtilization"] = (
        df["Comb_Efficiency"]
        *
        df["FuelFlow_kg_s"]
    )

    # Combustor Health Index
    df["Comb_HealthIndex"] = (
        df["Comb_Efficiency"]
        *
        df["Comb_PressureRecovery"]
    )
    # ------------------------------------------------------
    # TURBINE PHYSICS
    # ------------------------------------------------------

    # Expansion Ratio
    df["Turb_ExpansionRatio"] = (
        df["P3_Pa"]
        /
        (
            df["P4_Pa"]
            +
            EPS
        )
    )

    # Temperature Ratio
    df["Turb_TR"] = (
        df["T4_K"]
        /
        (
            df["T3_K"]
            +
            EPS
        )
    )

    # Pressure Drop
    df["Turb_PressureDrop"] = (
        df["P3_Pa"]
        -
        df["P4_Pa"]
    )

    # Temperature Drop
    df["Turb_TempDrop"] = (
        df["T3_K"]
        -
        df["T4_K"]
    )

    # Turbine Work
    df["Turb_Work"] = (
        CP_AIR
        *
        df["Turb_TempDrop"]
    )

    # Isentropic Exit Temperature
    df["Turb_Isentropic_T4"] = (
        df["T3_K"]
        *
        np.power(
            1
            /
            (
                df["Turb_ExpansionRatio"]
                +
                EPS
            ),
            (GAMMA - 1) / GAMMA
        )
    )

    # Turbine Efficiency
    df["Turb_Efficiency"] = (
        df["Turb_TempDrop"]
        /
        (
            (
                df["T3_K"]
                -
                df["Turb_Isentropic_T4"]
            )
            +
            EPS
        )
    )

    # Turbine Loading
    df["Turb_Loading"] = (
        df["Turb_Work"]
        /
        (
            df["RPM_rev_min"]
            +
            EPS
        )
    )

    # Turbine Power Proxy
    df["Turb_PowerProxy"] = (
        df["Turb_Work"]
        *
        df["RPM_rev_min"]
    )

    # Turbine Energy Index
    df["Turb_EnergyIndex"] = (
        df["Turb_ExpansionRatio"]
        *
        df["RPM_rev_min"]
    )

    # Pressure Drop per RPM
    df["PressureDropPerRPM"] = (
        df["Turb_PressureDrop"]
        /
        (
            df["RPM_rev_min"]
            +
            EPS
        )
    )

    # Pressure Drop per Fuel
    df["PressureDropPerFuel"] = (
        df["Turb_PressureDrop"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Temperature Drop per Fuel
    df["TempDropPerFuel"] = (
        df["Turb_TempDrop"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Work per Fuel
    df["Turb_WorkPerFuel"] = (
        df["Turb_Work"]
        /
        (
            df["FuelFlow_kg_s"]
            +
            EPS
        )
    )

    # Expansion Work Index
    df["ExpansionWorkIndex"] = (
        df["Turb_Work"]
        *
        df["Turb_ExpansionRatio"]
    )

    # Thermal Extraction Index
    df["ThermalExtraction"] = (
        df["Turb_TempDrop"]
        *
        df["Turb_Efficiency"]
    )

    # Turbine Mechanical Index
    df["Turb_MechanicalIndex"] = (
        df["Turb_Loading"]
        *
        df["RPM_rev_min"]
    )

    # Turbine Health Index
    df["Turb_HealthIndex"] = (
        df["Turb_Efficiency"]
        *
        df["Turb_ExpansionRatio"]
    )

    # Cooling Effectiveness
    df["CoolingEffectiveness"] = (
        df["Turb_TempDrop"]
        /
        (
            df["T3_K"]
            +
            EPS
        )
    )

    # Exhaust Energy
    df["ExhaustEnergy"] = (
        CP_AIR
        *
        df["T4_K"]
    )

    # Remaining Thermal Energy
    df["RemainingThermalEnergy"] = (
        df["FuelEnergy"]
        -
        df["Turb_Work"]
    )
    # ------------------------------------------------------
    # BRAYTON CYCLE FEATURES
    # ------------------------------------------------------

    # Overall Pressure Ratio (OPR)
    df["OverallPressureRatio"] = (
        df["P2_Pa"] /
        (
            df["Pamb_Pa"]
            +
            EPS
        )
    )

    # Net Specific Work
    df["NetSpecificWork"] = (
        df["Turb_Work"]
        -
        df["Comp_Work"]
    )

    # Brayton Thermal Efficiency
    df["ThermalEfficiency"] = (
        df["NetSpecificWork"]
        /
        (
            df["FuelEnergy"]
            +
            EPS
        )
    )

    # Cycle Work Ratio
    df["CycleWorkRatio"] = (
        df["Turb_Work"]
        /
        (
            df["Comp_Work"]
            +
            EPS
        )
    )

    # Brayton Index
    df["BraytonIndex"] = (
        df["OverallPressureRatio"]
        *
        df["ThermalEfficiency"]
    )

    # ------------------------------------------------------
    # ENGINE LOADING
    # ------------------------------------------------------

    df["FuelPerRPM"] = (
        df["FuelFlow_kg_s"]
        /
        (
            df["RPM_rev_min"]
            +
            EPS
        )
    )

    df["EngineLoad"] = (
        df["FuelFlow_kg_s"]
        *
        df["RPM_rev_min"]
    )

    df["ThermalLoading"] = (
        df["FuelFlow_kg_s"]
        *
        df["T3_K"]
    )

    df["MechanicalLoading"] = (
        df["Comp_PR"]
        *
        df["RPM_rev_min"]
    )

    df["PowerLoading"] = (
        df["Comp_Work"]
        +
        df["Turb_Work"]
    )

    df["OverallLoadingIndex"] = (
        df["MechanicalLoading"]
        +
        df["ThermalLoading"]
    )

    # ------------------------------------------------------
    # PRESSURE FEATURES
    # ------------------------------------------------------

    df["PressureGradient"] = (
        df["P2_Pa"]
        -
        df["P4_Pa"]
    )

    df["PressureRise"] = (
        df["P2_Pa"]
        -
        df["Pamb_Pa"]
    )

    df["PressureDrop"] = (
        df["P3_Pa"]
        -
        df["P4_Pa"]
    )

    df["PressureRatioIndex"] = (
        df["Comp_PR"]
        *
        df["Turb_ExpansionRatio"]
    )

    # ------------------------------------------------------
    # TEMPERATURE FEATURES
    # ------------------------------------------------------

    df["TemperatureGradient"] = (
        df["T3_K"]
        -
        df["Tamb_K"]
    )

    df["TemperatureRise"] = (
        df["T2_K"]
        -
        df["Tamb_K"]
    )

    df["TemperatureDrop"] = (
        df["T3_K"]
        -
        df["T4_K"]
    )

    df["TemperatureRatioIndex"] = (
        df["Comp_TR"]
        *
        df["Turb_TR"]
    )

    # ------------------------------------------------------
    # FLIGHT CONDITION FEATURES
    # ------------------------------------------------------

    df["AltitudeMach"] = (
        df["Altitude_m"]
        *
        df["Mach"]
    )

    df["RPMMach"] = (
        df["RPM_rev_min"]
        *
        df["Mach"]
    )

    df["FuelMach"] = (
        df["FuelFlow_kg_s"]
        *
        df["Mach"]
    )

    df["DynamicPressureRPM"] = (
        df["DynamicPressure"]
        *
        df["RPM_rev_min"]
    )

    df["DynamicPressureFuel"] = (
        df["DynamicPressure"]
        *
        df["FuelFlow_kg_s"]
    )

    # ------------------------------------------------------
    # NORMALIZED FEATURES
    # ------------------------------------------------------

    df["FuelPerPressure"] = (
        df["FuelFlow_kg_s"]
        /
        (
            df["DynamicPressure"]
            +
            EPS
        )
    )

    df["RPMPerPressure"] = (
        df["RPM_rev_min"]
        /
        (
            df["DynamicPressure"]
            +
            EPS
        )
    )

    df["WorkPerPressure"] = (
        df["NetSpecificWork"]
        /
        (
            df["DynamicPressure"]
            +
            EPS
        )
    )

    # ------------------------------------------------------
    # DIGITAL TWIN HEALTH INDICES
    # ------------------------------------------------------

    df["OverallEfficiencyIndex"] = (
        df["Comp_Efficiency"]
        *
        df["Comb_Efficiency"]
        *
        df["Turb_Efficiency"]
    )

    df["EngineStressIndex"] = (
        df["MechanicalLoading"]
        *
        df["ThermalLoading"]
    )

    df["EnergyBalanceIndex"] = (
        df["FuelEnergy"]
        -
        (
            df["Comp_Work"]
            +
            df["Turb_Work"]
        )
    )

    df["PressureTemperatureIndex"] = (
        df["PressureGradient"]
        *
        df["TemperatureGradient"]
    )

    df["PerformanceIndex"] = (
        df["OverallPressureRatio"]
        *
        df["OverallEfficiencyIndex"]
    )

    df["DigitalTwinHealthIndex"] = (
        df["PerformanceIndex"]
        /
        (
            df["EngineStressIndex"]
            +
            EPS
        )
    )
    # ------------------------------------------------------
    # REMOVE INVALID VALUES
    # ------------------------------------------------------

    df.replace(
        [np.inf, -np.inf],
        np.nan,
        inplace=True
    )

    # ------------------------------------------------------
    # FORWARD / BACKWARD FILL
    # ------------------------------------------------------

    df.ffill(inplace=True)

    df.bfill(inplace=True)

    # ------------------------------------------------------
    # FINAL FALLBACK
    # ------------------------------------------------------

    df.fillna(0, inplace=True)

    # ------------------------------------------------------
    # REMOVE DUPLICATE COLUMNS
    # ------------------------------------------------------

    df = df.loc[:, ~df.columns.duplicated()]

    # ------------------------------------------------------
    # REMOVE CONSTANT FEATURES
    # ------------------------------------------------------

    constant_columns = [

        c

        for c in df.columns

        if df[c].nunique() <= 1

    ]

    if constant_columns:

        df.drop(

            columns=constant_columns,

            inplace=True,

            errors="ignore"

        )

    # ------------------------------------------------------
    # REMOVE VERY LOW VARIANCE FEATURES
    # ------------------------------------------------------

    low_variance = []

    for column in df.columns:

        if df[column].dtype != object:

            if df[column].std() < 1e-10:

                low_variance.append(column)

    if low_variance:

        df.drop(

            columns=low_variance,

            inplace=True,

            errors="ignore"

        )

    # ------------------------------------------------------
    # FEATURE SUMMARY
    # ------------------------------------------------------

    original_features = len(REQUIRED_COLUMNS)

    engineered_features = len(df.columns) - original_features

    print("\n" + "=" * 60)

    print("FEATURE ENGINEERING SUMMARY")

    print("=" * 60)

    print(f"Original Sensor Features : {original_features}")

    print(f"Engineered Features      : {engineered_features}")

    print(f"Total Features           : {len(df.columns)}")

    print(f"Rows                     : {len(df)}")

    print("=" * 60)

    # ------------------------------------------------------
    # SANITY CHECK
    # ------------------------------------------------------

    if df.isnull().sum().sum():

        raise ValueError(

            "NaN values remain after feature engineering."

        )

    if np.isinf(df.select_dtypes(include=np.number)).sum().sum():

        raise ValueError(

            "Infinite values remain after feature engineering."

        )

    return df
def get_feature_columns(df: pd.DataFrame):

    """
    Returns only ML input features.
    Removes identifiers and targets.
    """

    excluded = {

        "EngineID",
        "Cycle",

        "CompressorHealth",
        "CombustorHealth",
        "TurbineHealth",
        "OverallHealth",

        "Thrust_N",
        "TSFC_g_N_s"

    }

    return [

        c

        for c in df.columns

        if c not in excluded

    ]