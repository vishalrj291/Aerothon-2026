"""
=========================================================
AeroTwin V3

Turbine Physics Model

Computes turbine thermodynamic performance.

Author : Team VayuCops
=========================================================
"""

from dataclasses import dataclass

import numpy as np
import pandas as pd

from physics.constants import (
    CP_AIR,
    GAMMA,
    EPS
)


@dataclass(slots=True)
class TurbineModel:

    # -------------------------------------------------
    # Expansion Ratio
    # -------------------------------------------------

    def expansion_ratio(self, p3, p4):

        return p3 / (p4 + EPS)

    # -------------------------------------------------

    def temperature_ratio(self, t4, t3):

        return t4 / (t3 + EPS)

    # -------------------------------------------------

    def temperature_drop(self, t3, t4):

        return t3 - t4

    # -------------------------------------------------

    def specific_work(self, t3, t4):

        return CP_AIR * (t3 - t4)

    # -------------------------------------------------

    def isentropic_exit_temperature(
        self,
        t3,
        expansion_ratio
    ):

        exponent = (GAMMA - 1) / GAMMA

        return t3 * np.power(
            1 / (expansion_ratio + EPS),
            exponent
        )

    # -------------------------------------------------

    def efficiency_proxy(
        self,
        t3,
        t4,
        expansion_ratio
    ):

        t4s = self.isentropic_exit_temperature(
            t3,
            expansion_ratio
        )

        eta = (
            (t3 - t4)
            /
            ((t3 - t4s) + EPS)
        )

        return np.clip(
            eta,
            0.0,
            1.0
        )

    # -------------------------------------------------

    def loading(
        self,
        work,
        rpm
    ):

        return work / (rpm + EPS)

    # -------------------------------------------------

    def power_proxy(
        self,
        work,
        rpm
    ):

        return work * rpm

    # -------------------------------------------------

    def expansion_index(
        self,
        expansion_ratio,
        temperature_ratio
    ):

        return expansion_ratio / (
            temperature_ratio + EPS
        )

    # -------------------------------------------------

    def compute(
        self,
        df: pd.DataFrame
    ):

        df = df.copy()

        df["Turb_ExpansionRatio"] = self.expansion_ratio(
            df["P3_Pa"],
            df["P4_Pa"]
        )

        df["Turb_TemperatureRatio"] = self.temperature_ratio(
            df["T4_K"],
            df["T3_K"]
        )

        df["Turb_TemperatureDrop"] = self.temperature_drop(
            df["T3_K"],
            df["T4_K"]
        )

        df["Turb_Work"] = self.specific_work(
            df["T3_K"],
            df["T4_K"]
        )

        df["Turb_Isentropic_T4"] = self.isentropic_exit_temperature(
            df["T3_K"],
            df["Turb_ExpansionRatio"]
        )

        df["Turb_Efficiency"] = self.efficiency_proxy(
            df["T3_K"],
            df["T4_K"],
            df["Turb_ExpansionRatio"]
        )

        df["Turb_Loading"] = self.loading(
            df["Turb_Work"],
            df["RPM_rev_min"]
        )

        df["Turb_PowerProxy"] = self.power_proxy(
            df["Turb_Work"],
            df["RPM_rev_min"]
        )

        df["Turb_ExpansionIndex"] = self.expansion_index(
            df["Turb_ExpansionRatio"],
            df["Turb_TemperatureRatio"]
        )

        return df