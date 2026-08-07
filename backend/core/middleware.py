"""
=========================================================
AeroTwin V6

Request Timing Middleware

=========================================================
"""

import time

from fastapi import Request


async def timing_middleware(request: Request, call_next):

    start = time.perf_counter()

    response = await call_next(request)

    elapsed = time.perf_counter() - start

    response.headers["X-Process-Time"] = f"{elapsed:.4f}s"

    return response