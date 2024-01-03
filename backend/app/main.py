from fastapi import FastAPI, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from api.api_v1.api import api_router

# from api.api_v1.estimation import estimator as estimator

app = FastAPI()
root_router = APIRouter()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(volume_calculations.router, prefix="/volume", tags=["Volume Calculations"])
# app.include_router(estimator.router, prefix = "/estimator", tags = ["Estimator"])

app.include_router(api_router)
app.include_router(root_router)