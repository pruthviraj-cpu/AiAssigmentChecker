from typing import Union
from fastapi import FastAPI
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request

from jose import JWTError, jwt
from services.teacherChatbot.TeacherChatBot import TeacherChatBot
from middleware.auth import auth_middleware

from app.models.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:80",
    "http://localhost",
    "http://localhost:5174",
    "http://127.0.0.1:5174"


]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # List of allowed origins
    allow_credentials=True,         # Allow cookies / Authorization headers
    allow_methods=["*"],            # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allow all headers
)


@app.get("/")
def read_root():
    return {"welcome to AiAssignmentChecker"}

@app.get("/health")
def health_check():
    return {"api is healthy"}

# @app.get("/teacherChatBot")
# def teacherChatBotHelper(current_user:dict = Depends(get_current_user)):
#     teacher_id = current_user["teacher"]
#     return{"teacher":teacher_id}

from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

@app.post("/teacherChatBottest",)
async def teacherChatBotHelpertest(request: Request,user=Depends(auth_middleware("teacher"))):
    body_as_dict = await request.json()

    response = await TeacherChatBot(str(user["teacher_id"]),body_as_dict["message"])
    
    return {"status": "success", "response": response,"user":user["teacher_id"]}


# @app.post("/protected")
# async def protected_route(user=Depends(auth_middleware("teacher"))):
#     return {"message": "Welcome!", "user": user}