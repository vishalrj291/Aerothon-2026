# ✈️ AeroTwin: Physics-Informed Four-Stage Turbojet Digital Twin

> Physics-informed Digital Twin for real-time turbojet engine health monitoring, performance prediction, explainable AI, predictive maintenance, and engineering decision support.

---

## 🚀 Project Overview

AeroTwin is an end-to-end Digital Twin developed using the official hackathon dataset. The project combines aerospace engineering principles with machine learning to estimate hidden engine health states, predict engine performance, diagnose faults, recommend maintenance actions, and visualize the complete engine condition through an interactive dashboard.

---

## ✨ Key Features

- Physics-Informed Feature Engineering
- Gas Path Analysis
- Multi-Model Benchmarking
- SHAP Explainability
- Uncertainty Quantification
- Fault Diagnosis
- Predictive Maintenance
- Remaining Useful Life (RUL)
- Virtual Sensors
- FastAPI Backend
- React Dashboard

---

# 🏗 Project Architecture

(Add Architecture Diagram)

---

# 📊 Exploratory Data Analysis

(Add only important figures)

### Feature Correlation

(image)

Explain in 2-3 lines.

---

### Target Distribution

(image)

Explain in 2-3 lines.

---

### Sensor Relationships

(image)

Explain in 2-3 lines.

---

# ⚙ Physics-Informed Feature Engineering

Describe:

- Compressor Pressure Ratio
- Compressor Temperature Rise
- Combustor Pressure Loss
- Turbine Pressure Ratio
- Turbine Temperature Drop
- Fuel per RPM

---

# 🤖 Machine Learning Pipeline

Dataset
↓

Physics Features
↓

Model Benchmarking
↓

Best Model Selection
↓

Digital Twin Prediction

---

# 📈 Model Benchmarking

| Target | Final Model | R² |
|--------|-------------|------:|
| Compressor Health | Extra Trees | 91.81% |
| Combustor Health | Extra Trees | 73.55% |
| Turbine Health | Ridge Regression | 88.90% |
| Overall Health | Extra Trees | 92.98% |
| Thrust | CatBoost | 98.67% |
| TSFC | CatBoost | 99.31% |

---

# 🔍 Explainable AI

(Add SHAP Summary Plot)

Explain what it shows.

---

# 📡 API

POST /predict

Example Request

```json
{
  ...
}
```

Example Response

```json
{
 ...
}
```

---

# 🖥 Dashboard

(Add Dashboard Screenshot)

(Add Prediction Screenshot)

(Add Health Gauges)

(Add Fault Diagnosis Screenshot)

(Add RUL Screenshot)

---

# 🛠 Tech Stack

## Languages

- Python
- JavaScript

## ML

- Scikit-learn
- CatBoost
- XGBoost
- LightGBM
- SHAP

## Backend

- FastAPI

## Frontend

- React
- Vite
- Axios
- Recharts

---

# 📂 Repository Structure

```text
dataset/
frontend/
models/
notebooks/
reports/
src/
```

---

# 🚀 Installation

```bash
git clone ...

pip install -r requirements.txt

npm install

uvicorn main:app --reload

npm run dev
```

---

# 🔮 Future Scope

- PINNs
- Bayesian Estimation
- Kalman Filter
- Fleet Monitoring
- IoT Integration
- Edge AI

---

# 👨‍💻 Authors

Team Name 
- Vayucops

Members
- Divyanshi(Leader)
- Vishal Raj
- Vaishnavi Jaiswal

---

# 📜 License

MIT
