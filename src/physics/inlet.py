"""
=========================================================
AeroTwin V3

Engine Inlet Physics

Computes compressor inlet stagnation conditions
from atmospheric measurements.

=========================================================
"""

from dataclasses import dataclass

import numpy as np
import pandas as pd

from physics.constants import (
    GAMMA,
    R_AIR,
    CP_AIR,
    EPS
)


@dataclass
class InletModel:

    # --------------------------------------------------
    # Speed of Sound
    # --------------------------------------------------

    def speed_of_sound(
        self,
        temperature
    ):

        return np.sqrt(
            GAMMA *
            R_AIR *
            temperature
        )


    # --------------------------------------------------
    # Flight Velocity
    # --------------------------------------------------

    def velocity(
        self,
        mach,
        speed_of_sound
    ):

        return mach * speed_of_sound


    # --------------------------------------------------
    # Total Temperature
    # --------------------------------------------------

    def total_temperature(
        self,
        temperature,
        mach
    ):

        return temperature * (
            1 +
            ((GAMMA - 1) / 2) *
            mach ** 2
        )


    # --------------------------------------------------
    # Total Pressure
    # --------------------------------------------------

    def total_pressure(
        self,
        pressure,
        mach
    ):

        exponent = GAMMA / (GAMMA - 1)

        return pressure * np.power(

            1 +
            ((GAMMA - 1) / 2) *
            mach ** 2,

            exponent

        )


    # --------------------------------------------------
    # Dynamic Pressure
    # --------------------------------------------------

    def dynamic_pressure(
        self,
        density,
        velocity
    ):

        return 0.5 * density * velocity ** 2


    # --------------------------------------------------
    # Air Density
    # --------------------------------------------------

    def air_density(
        self,
        pressure,
        temperature
    ):

        return pressure / (
            R_AIR *
            temperature +
            EPS
        )


    # --------------------------------------------------
    # Enthalpy
    # --------------------------------------------------

    def enthalpy(
        self,
        temperature
    ):

        return CP_AIR * temperature


    # --------------------------------------------------
    # Main Compute
    # --------------------------------------------------

    def compute(
        self,
        df: pd.DataFrame
    ):

        df = df.copy()

        df["AirDensity"] = self.air_density(
            df["Pamb_Pa"],
            df["Tamb_K"]
        )

        df["SpeedOfSound"] = self.speed_of_sound(
            df["Tamb_K"]
        )

        df["TrueAirSpeed"] = self.velocity(
            df["Mach"],
            df["SpeedOfSound"]
        )

        df["DynamicPressure"] = self.dynamic_pressure(
            df["AirDensity"],
            df["TrueAirSpeed"]
        )

        df["TotalTemperature"] = self.total_temperature(
            df["Tamb_K"],
            df["Mach"]
        )

        df["TotalPressure"] = self.total_pressure(
            df["Pamb_Pa"],
            df["Mach"]
        )

        df["AmbientEnthalpy"] = self.enthalpy(
            df["Tamb_K"]
        )

        df["TotalEnthalpy"] = self.enthalpy(
            df["TotalTemperature"]
        )

        return df