"""
=========================================================
AeroTwin V3

Residual Generator

Computes deviation of measured engine behaviour
from healthy baseline behaviour.

Author : Team VayuCops
=========================================================
"""

from dataclasses import dataclass

import pandas as pd


@dataclass(slots=True)
class ResidualModel:

    baseline: dict

    # -------------------------------------------------

    def residual(
        self,
        actual,
        expected
    ):

        return actual - expected

    # -------------------------------------------------

    def compute(
        self,
        df: pd.DataFrame
    ):

        df = df.copy()

        df["Res_Comp_PR"] = self.residual(
            df["Comp_PR"],
            self.baseline["Comp_PR"]
        )

        df["Res_Comp_Eff"] = self.residual(
            df["Comp_Efficiency"],
            self.baseline["Comp_Efficiency"]
        )

        df["Res_Comb_PressureLoss"] = self.residual(
            df["Comb_PressureLoss"],
            self.baseline["Comb_PressureLoss"]
        )

        df["Res_Comb_Eff"] = self.residual(
            df["Comb_Efficiency"],
            self.baseline["Comb_Efficiency"]
        )

        df["Res_Turb_Work"] = self.residual(
            df["Turb_Work"],
            self.baseline["Turb_Work"]
        )

        df["Res_Turb_Eff"] = self.residual(
            df["Turb_Efficiency"],
            self.baseline["Turb_Efficiency"]
        )

        df["Res_Thermal_Eff"] = self.residual(
            df["ThermalEfficiency"],
            self.baseline["ThermalEfficiency"]
        )

        return df