"""
Dataset Based Validation
"""

from fastapi import HTTPException

from backend.core.limits import LIMITS


def validate_ranges(data: dict):

    for feature, value in data.items():

        if feature not in LIMITS:
            continue

        if not isinstance(value, (int, float)):
            continue

        lower = LIMITS[feature]["min"]
        upper = LIMITS[feature]["max"]

        if value < lower or value > upper:

            raise HTTPException(

                status_code=400,

                detail=(
                    f"{feature}={value} is outside "
                    f"allowed range [{lower:.2f}, {upper:.2f}]"
                )

            )