"""
=========================================================
AeroTwin Backend

FastAPI Entry Point

=========================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.middleware import timing_middleware
from backend.api.prediction import router as prediction_router
from backend.api.health import router as health_router
from backend.api.model_info import router as model_router
from backend.api.download import router as download_router

from backend.core.startup import initialize
from backend.core.exceptions import register_exception_handlers

app = FastAPI(
    title="AeroTwin API",
    version="6.0",
    description="""
Physics Guided Digital Twin for Turbojet Engine Health Monitoring.

Available APIs:

• Health
• Prediction
• Model Information
• Download
""",
    contact={
        "name": "AeroTwin Team",
    },
)

# ==========================================================
# Middleware
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(timing_middleware)

# ==========================================================
# Exception Handlers
# ==========================================================

register_exception_handlers(app)

# ==========================================================
# Startup
# ==========================================================

@app.on_event("startup")
def startup():
    initialize()

# ==========================================================
# Routers
# ==========================================================

app.include_router(prediction_router)
app.include_router(health_router)
app.include_router(model_router)
app.include_router(download_router)

# ==========================================================
# Root
# ==========================================================

@app.get("/", tags=["Root"])
def home():
    return {
        "Project": "AeroTwin",
        "Version": "6.0",
        "Status": "Running",
    }