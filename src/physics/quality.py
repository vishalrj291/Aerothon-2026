"""
=========================================================
AeroTwin V3

Physics Data Quality Assessment

=========================================================
"""

from dataclasses import dataclass, field
from typing import List


@dataclass
class DataQualityResult:

    score: float = 100.0

    status: str = "PASS"

    errors: List[str] = field(default_factory=list)

    warnings: List[str] = field(default_factory=list)


class DataQualityEngine:

    def evaluate(self, validation_result):

        result = DataQualityResult()

        # Critical errors
        if validation_result.errors:

            result.score -= 40

            result.errors.extend(validation_result.errors)

        # Warnings
        if validation_result.warnings:

            penalty = min(
                len(validation_result.warnings) * 5,
                25
            )

            result.score -= penalty

            result.warnings.extend(
                validation_result.warnings
            )

        result.score = max(0, result.score)

        if result.score >= 90:
            result.status = "PASS"

        elif result.score >= 70:
            result.status = "PASS WITH WARNINGS"

        elif result.score >= 50:
            result.status = "LOW CONFIDENCE"

        else:
            result.status = "FAIL"

        return result