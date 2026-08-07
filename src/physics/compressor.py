"""
=========================================================
AeroTwin V3

Production Compressor Physics Model

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


@dataclass
class CompressorModel:

    def pressure_ratio(self, P2, P1):

        return P2 / (P1 + EPS)

    def pressure_rise(self, P2, P1):

        return P2 - P1

    def temperature_ratio(self, T2, T1):

        return T2 / (T1 + EPS)

    def temperature_rise(self, T2, T1):

        return T2 - T1

    def specific_work(self, T1, T2):

        return CP_AIR * (T2 - T1)

    def isentropic_temperature(self, T1, PR):

        exponent = (GAMMA - 1.0) / GAMMA

        return T1 * np.power(PR, exponent)

    def efficiency_proxy(self, T1, T2, PR):

        T2s = self.isentropic_temperature(
            T1,
            PR
        )

        eta = (T2s - T1) / (
            (T2 - T1) + EPS
        )

        return np.clip(eta, 0.0, 1.0)

    def loading(self, work, rpm):

        return work / (rpm + EPS)

    def power_proxy(self, work, rpm):

        return work * rpm

    def compression_index(self, PR, TR):

        return PR / (TR + EPS)

    def compute(
        self,
        df: pd.DataFrame
    ):

        df = df.copy()

        df["Comp_PR"] = self.pressure_ratio(
            df["P2_Pa"],
            df["Pamb_Pa"]
        )

        df["Comp_PressureRise"] = self.pressure_rise(
            df["P2_Pa"],
            df["Pamb_Pa"]
        )

        df["Comp_TR"] = self.temperature_ratio(
            df["T2_K"],
            df["Tamb_K"]
        )

        df["Comp_TemperatureRise"] = self.temperature_rise(
            df["T2_K"],
            df["Tamb_K"]
        )

        df["Comp_Work"] = self.specific_work(
            df["Tamb_K"],
            df["T2_K"]
        )

        df["Comp_Isentropic_T2"] = self.isentropic_temperature(
            df["Tamb_K"],
            df["Comp_PR"]
        )

        df["Comp_Efficiency"] = self.efficiency_proxy(
            df["Tamb_K"],
            df["T2_K"],
            df["Comp_PR"]
        )

        df["Comp_Loading"] = self.loading(
            df["Comp_Work"],
            df["RPM_rev_min"]
        )

        df["Comp_PowerProxy"] = self.power_proxy(
            df["Comp_Work"],
            df["RPM_rev_min"]
        )

        df["Comp_CompressionIndex"] = self.compression_index(
            df["Comp_PR"],
            df["Comp_TR"]
        )

        return df