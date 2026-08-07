"""
=========================================================
AeroTwin V3

Combustor Physics Model

Uses first-law thermodynamics to estimate
combustion performance.

=========================================================
"""

from dataclasses import dataclass

import numpy as np
import pandas as pd

from physics.constants import (
    CP_AIR,
    LHV_FUEL,
    EPS
)


@dataclass(slots=True)
class CombustorModel:

    def pressure_loss(self, p2, p3):
        return (p2 - p3) / (p2 + EPS)

    def pressure_recovery(self, p2, p3):
        return p3 / (p2 + EPS)

    def temperature_rise(self, t2, t3):
        return t3 - t2

    def heat_added(self, t2, t3):
        return CP_AIR * (t3 - t2)

    def fuel_energy(self, fuel_flow):
        return fuel_flow * LHV_FUEL

    def combustion_efficiency(
        self,
        heat_added,
        fuel_energy
    ):
        eta = heat_added / (fuel_energy + EPS)

        return np.clip(
            eta,
            0.0,
            1.0
        )

    def fuel_to_heat_ratio(
        self,
        heat_added,
        fuel_flow
    ):
        return heat_added / (fuel_flow + EPS)

    def compute(
        self,
        df: pd.DataFrame
    ):

        df = df.copy()

        df["Comb_PressureLoss"] = self.pressure_loss(
            df["P2_Pa"],
            df["P3_Pa"]
        )

        df["Comb_PressureRecovery"] = self.pressure_recovery(
            df["P2_Pa"],
            df["P3_Pa"]
        )

        df["Comb_TemperatureRise"] = self.temperature_rise(
            df["T2_K"],
            df["T3_K"]
        )

        df["Comb_HeatAdded"] = self.heat_added(
            df["T2_K"],
            df["T3_K"]
        )

        df["FuelEnergy"] = self.fuel_energy(
            df["FuelFlow_kg_s"]
        )

        df["Comb_Efficiency"] = self.combustion_efficiency(
            df["Comb_HeatAdded"],
            df["FuelEnergy"]
        )

        df["FuelToHeatRatio"] = self.fuel_to_heat_ratio(
            df["Comb_HeatAdded"],
            df["FuelFlow_kg_s"]
        )

        return df