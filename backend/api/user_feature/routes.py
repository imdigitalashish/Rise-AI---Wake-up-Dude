from fastapi import APIRouter, HTTPException
from asgiref.sync import sync_to_async
from api.config import configureDjangoSettings
from starlette.concurrency import run_in_threadpool
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
import uuid
from django.db import models

configureDjangoSettings()


from platformusers.models import PlatformUsers
from api.user_feature.models import UserRegistration, UserLogin

router = APIRouter(
    tags=["user_feature"],
    prefix="/user_feature"
)



@router.post("/register")
async def register_user(user_data: UserRegistration):
    if await sync_to_async(PlatformUsers.objects.filter(username=user_data.username).exists)():
        raise HTTPException(status_code=400, detail="Username already exists.")
    if await sync_to_async(PlatformUsers.objects.filter(email=user_data.email).exists)():
        raise HTTPException(status_code=400, detail="Email already exists.")

    hashed_password = make_password(user_data.password)

    await sync_to_async(PlatformUsers.objects.create)(
        username=user_data.username,
        password=hashed_password,
        email=user_data.email,
        uuid=str(uuid.uuid4())
    )

    return {"message": "User registered successfully"}



def generate_token():
    return uuid.uuid4()


@router.post("/login")
async def login_user(login_data: UserLogin):
    user = await sync_to_async(
        lambda: PlatformUsers.objects.filter(
            models.Q(username=login_data.identifier) | models.Q(email=login_data.identifier)
        ).first()
    )()

    if not user:
        raise HTTPException(status_code=400, detail="no user found")

    # Verify the password
    if not check_password(login_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid username/email or password.")

    
    token = generate_token()
    user.token = token
    await sync_to_async(user.save)()

    return {"message": "Login successful", "token": token}