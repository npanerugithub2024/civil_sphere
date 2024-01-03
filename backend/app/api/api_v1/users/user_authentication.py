
from fastapi import FastAPI, HTTPException, Depends, status, APIRouter  
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from email_validator import validate_email, EmailNotValidError


app = FastAPI()
router = APIRouter()


client = AsyncIOMotorClient("mongodb://mongodb:27018/")  # Note the hostname is 'mongodb' as defined in docker-compose file
user_database = client.users
collection = user_database["users"]

# # Database settings
# MONGO_DETAILS = "mongodb://localhost:27018/"
# client = AsyncIOMotorClient(MONGO_DETAILS)
# db = client.users
# collection = db["users"]

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 password bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    disabled: Optional[bool] = None

class User(BaseModel):
    username: str
    email: EmailStr
    disabled: Optional[bool] = None

class UserIn(BaseModel):
    username: str
    email: EmailStr
    password: str

class Token(BaseModel):
    username : str
    access_token: str
    token_type: str

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(username: str):
    if (user := await collection.find_one({"username": username})):
        return UserInDB(**user)

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# JWT functions
def create_access_token(data: dict):
    to_encode = data.copy()
    jwt_encoded = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_encoded

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = username
    except JWTError:
        raise credentials_exception
    user = await get_user(username=token_data)
    if user is None:
        raise credentials_exception
    return user

# Endpoints
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return { "username":user.username, "access_token": access_token, "token_type": "bearer"}

@router.post("/signup/", response_model=User)
async def create_user(user: UserIn):
    try:
        # Validate email
        validate_email(user.email)
        # Hash the user's password
        hashed_password = get_password_hash(user.password)
        user_in_db = UserInDB(**user.dict(), hashed_password=hashed_password)
        # Insert the user in the database
        await collection.insert_one(user_in_db.dict())
        return user_in_db
    except EmailNotValidError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/validateToken", response_model=User)
async def validate_token(current_user: User = Depends(get_current_user)):
    """
    Validates the access token from the Authorization header.
    If the token is valid, returns the current user's data.
    """
    return current_user
