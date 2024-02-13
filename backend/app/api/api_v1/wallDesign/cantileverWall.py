from fastapi import FastAPI, APIRouter , logger,HTTPException, Body, Depends,UploadFile,File
from pydantic import BaseModel, Field
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from collections import defaultdict
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from ..users.user_authentication import User, get_current_user
import pandas as pd
from io import StringIO
from fastapi.responses import JSONResponse


app = FastAPI()
router = APIRouter()


class Wall(BaseModel):
    name: Optional[str]
    toelength_a: float
    wallthick_b: float
    heellength_c: float
    stemheight_H: float
    footingdepth_Hf: float
    lengthoffooting_Lf: float
    concreteunitweight: float
    keydistancefromrotatingpoint: float
    keydepth: float
    keywidth: float
    soilunitweight: float
    frictionangle: float
    factoredbearingresistanceinstrength: float
    factoredbearingresistanceinservice: float
    coefficientoffriction_f: float
    resistancefactorforsliding: float
    heq: float

# just commenting out
@router.post("/wall_volume") 
async def wall_weight(data: Wall):
    print(data, "is the printed data")  # Log the received data
    weight1 = data.keydepth * data.keywidth * data.lengthoffooting_Lf
    weight2 = data.stemheight_H * data.wallthick_b * data.lengthoffooting_Lf
    weight3 = data.heellength_c * data.footingdepth_Hf * data.lengthoffooting_Lf
    return {"weight1": weight1, "weight2":weight2, "weight3":weight3}
