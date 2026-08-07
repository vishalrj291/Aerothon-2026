"""
=========================================================
AeroTwin V3

Physics Validation Module

Validates incoming engine sensor data before
performing any thermodynamic calculations.

Author : Team VayuCops
=========================================================
"""

from dataclasses import dataclass
from typing import List

import pandas as pd


# =========================================================
# Validation Result
# =========================================================

@dataclass
class ValidationResult:

    valid: bool

    errors: List[str]

    warnings: List[str]


# =========================================================
# Physics Validator
# =========================================================

class PhysicsValidator:

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

    # ------------------------------------------------------

    def validate_columns(self, df):

        errors = []

        for col in self.REQUIRED_COLUMNS:

            if col not in df.columns:

                errors.append(
                    f"Missing column: {col}"
                )

        return errors

    # ------------------------------------------------------

    def validate_missing_values(self, df):

        errors = []

        missing = df.isnull().sum()

        for col, count in missing.items():

            if count > 0:

                errors.append(
                    f"{col} contains {count} missing values."
                )

        return errors

    # ------------------------------------------------------

    def validate_pressure(self, df):

        errors = []

        pressure_cols = [

            "Pamb_Pa",
            "P2_Pa",
            "P3_Pa",
            "P4_Pa"

        ]

        for col in pressure_cols:

            if (df[col] <= 0).any():

                errors.append(
                    f"{col} contains non-positive values."
                )

        return errors

    # ------------------------------------------------------

    def validate_temperature(self, df):

        errors = []

        temperature_cols = [

            "Tamb_K",
            "T2_K",
            "T3_K",
            "T4_K"

        ]

        for col in temperature_cols:

            if (df[col] <= 0).any():

                errors.append(
                    f"{col} contains non-physical temperatures."
                )

        return errors

    # ------------------------------------------------------

    def validate_mach(self, df):

        warnings = []

        if (df["Mach"] < 0).any():

            warnings.append(
                "Negative Mach number detected."
            )

        if (df["Mach"] > 3).any():

            warnings.append(
                "Mach number exceeds expected turbojet operating range."
            )

        return warnings

    # ------------------------------------------------------

    def validate_rpm(self, df):

        errors = []

        if (df["RPM_rev_min"] <= 0).any():

            errors.append(
                "RPM must be greater than zero."
            )

        return errors

    # ------------------------------------------------------

    def validate_fuel_flow(self, df):

        errors = []

        if (df["FuelFlow_kg_s"] < 0).any():

            errors.append(
                "Fuel Flow cannot be negative."
            )

        return errors

    # ------------------------------------------------------

    def validate_engine_order(self, df):

        warnings = []

        if (df["P2_Pa"] <= df["Pamb_Pa"]).any():

            warnings.append(
                "Compressor outlet pressure lower than ambient detected."
            )

        if (df["P3_Pa"] >= df["P2_Pa"]).any():

            warnings.append(
                "Combustor pressure is greater than compressor outlet pressure."
            )

        if (df["T3_K"] <= df["T2_K"]).any():

            warnings.append(
                "Combustor outlet temperature lower than compressor outlet."
            )

        if (df["T4_K"] >= df["T3_K"]).any():

            warnings.append(
                "Turbine outlet temperature higher than turbine inlet."
            )

        return warnings

    # ------------------------------------------------------

    def validate(self, df):

        errors = []

        warnings = []

        errors.extend(self.validate_columns(df))

        if errors:

            return ValidationResult(

                valid=False,

                errors=errors,

                warnings=[]

            )

        errors.extend(

            self.validate_missing_values(df)

        )

        errors.extend(

            self.validate_pressure(df)

        )

        errors.extend(

            self.validate_temperature(df)

        )

        errors.extend(

            self.validate_rpm(df)

        )

        errors.extend(

            self.validate_fuel_flow(df)

        )

        warnings.extend(

            self.validate_mach(df)

        )

        warnings.extend(

            self.validate_engine_order(df)

        )

        return ValidationResult(

            valid=len(errors) == 0,

            errors=errors,

            warnings=warnings

        )