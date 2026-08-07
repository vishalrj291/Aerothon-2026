"""
=========================================================
AeroTwin V3

Thermodynamics Engine

Core thermodynamic utilities used by every physics module.

Author : Team VayuCops
=========================================================
"""

from dataclasses import dataclass
import numpy as np

from physics.constants import (
    CP_AIR,
    CV_AIR,
    GAMMA,
    R_AIR,
    EPS
)


@dataclass(slots=True)
class ThermodynamicsEngine:

    # -----------------------------------------------------
    # Ideal Gas Law
    # rho = P / (R*T)
    # -----------------------------------------------------

    def density(
        self,
        pressure,
        temperature
    ):

        return pressure / (
            R_AIR * temperature + EPS
        )

    # -----------------------------------------------------
    # Specific Enthalpy
    # h = Cp*T
    # -----------------------------------------------------

    def enthalpy(
        self,
        temperature
    ):

        return CP_AIR * temperature

    # -----------------------------------------------------
    # Internal Energy
    # u = Cv*T
    # -----------------------------------------------------

    def internal_energy(
        self,
        temperature
    ):

        return CV_AIR * temperature

    # -----------------------------------------------------
    # Speed of Sound
    # a = sqrt(gamma*R*T)
    # -----------------------------------------------------

    def speed_of_sound(
        self,
        temperature
    ):

        return np.sqrt(
            GAMMA *
            R_AIR *
            temperature
        )

    # -----------------------------------------------------
    # Flight Velocity
    # V = Mach*a
    # -----------------------------------------------------

    def velocity(
        self,
        mach,
        speed_of_sound
    ):

        return mach * speed_of_sound

    # -----------------------------------------------------
    # Dynamic Pressure
    # q = 0.5*rho*V²
    # -----------------------------------------------------

    def dynamic_pressure(
        self,
        density,
        velocity
    ):

        return (
            0.5 *
            density *
            velocity**2
        )

    # -----------------------------------------------------
    # Total Temperature
    # -----------------------------------------------------

    def total_temperature(
        self,
        temperature,
        mach
    ):

        return temperature * (

            1 +

            ((GAMMA - 1) / 2) *

            mach**2

        )

    # -----------------------------------------------------
    # Total Pressure
    # -----------------------------------------------------

    def total_pressure(
        self,
        pressure,
        mach
    ):

        exponent = GAMMA / (GAMMA - 1)

        return pressure * np.power(

            1 +

            ((GAMMA - 1) / 2) *

            mach**2,

            exponent

        )

    # -----------------------------------------------------
    # Total Enthalpy
    # -----------------------------------------------------

    def total_enthalpy(
        self,
        total_temperature
    ):

        return CP_AIR * total_temperature

    # -----------------------------------------------------
    # Isentropic Temperature
    # -----------------------------------------------------

    def isentropic_temperature(
        self,
        inlet_temperature,
        pressure_ratio
    ):

        exponent = (GAMMA - 1) / GAMMA

        return inlet_temperature * np.power(

            pressure_ratio,

            exponent

        )

    # -----------------------------------------------------
    # Pressure Ratio
    # -----------------------------------------------------

    def pressure_ratio(
        self,
        outlet_pressure,
        inlet_pressure
    ):

        return outlet_pressure / (

            inlet_pressure +

            EPS

        )

    # -----------------------------------------------------
    # Temperature Ratio
    # -----------------------------------------------------

    def temperature_ratio(
        self,
        outlet_temperature,
        inlet_temperature
    ):

        return outlet_temperature / (

            inlet_temperature +

            EPS

        )

    # -----------------------------------------------------
    # Specific Work
    # -----------------------------------------------------

    def specific_work(
        self,
        inlet_temperature,
        outlet_temperature
    ):

        return CP_AIR * (

            outlet_temperature -

            inlet_temperature

        )

    # -----------------------------------------------------
    # Thermal Efficiency
    # -----------------------------------------------------

    def thermal_efficiency(
        self,
        turbine_work,
        compressor_work,
        fuel_energy
    ):

        net = turbine_work - compressor_work

        return net / (

            fuel_energy +

            EPS

        )

    # -----------------------------------------------------
    # Relative Entropy Change
    # -----------------------------------------------------

    def entropy_change(
        self,
        T2,
        T1,
        P2,
        P1
    ):

        return (

            CP_AIR *

            np.log(

                (T2 + EPS) /

                (T1 + EPS)

            )

            -

            R_AIR *

            np.log(

                (P2 + EPS) /

                (P1 + EPS)

            )

        )