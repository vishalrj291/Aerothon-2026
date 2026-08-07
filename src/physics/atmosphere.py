"""
=========================================================
AeroTwin V3

Atmosphere Model

Computes atmospheric state from flight conditions.

Uses ISA-compatible thermodynamic relationships
based on measured pressure and temperature.

Author : Team VayuCops
=========================================================
"""

from dataclasses import dataclass

import pandas as pd

from physics.thermodynamics import ThermodynamicsEngine


@dataclass(slots=True)
class AtmosphereModel:

    thermo: ThermodynamicsEngine = ThermodynamicsEngine()

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:

        df = df.copy()

        # -------------------------------------------------
        # Static Atmosphere
        # -------------------------------------------------

        df["AirDensity"] = self.thermo.density(
            df["Pamb_Pa"],
            df["Tamb_K"]
        )

        df["AmbientEnthalpy"] = self.thermo.enthalpy(
            df["Tamb_K"]
        )

        # -------------------------------------------------
        # Compressible Flow
        # -------------------------------------------------

        df["SpeedOfSound"] = self.thermo.speed_of_sound(
            df["Tamb_K"]
        )

        df["TrueAirSpeed"] = self.thermo.velocity(
            df["Mach"],
            df["SpeedOfSound"]
        )

        df["DynamicPressure"] = self.thermo.dynamic_pressure(
            df["AirDensity"],
            df["TrueAirSpeed"]
        )

        # -------------------------------------------------
        # Stagnation Properties
        # -------------------------------------------------

        df["TotalTemperature"] = self.thermo.total_temperature(
            df["Tamb_K"],
            df["Mach"]
        )

        df["TotalPressure"] = self.thermo.total_pressure(
            df["Pamb_Pa"],
            df["Mach"]
        )

        df["TotalEnthalpy"] = self.thermo.total_enthalpy(
            df["TotalTemperature"]
        )

        return df