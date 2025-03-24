from pydantic import BaseModel, EmailStr


class UserRegistration(BaseModel):
    username: str
    password: str
    email: EmailStr
    
    
    
# Pydantic model for login request
class UserLogin(BaseModel):
    identifier: str  # Can be either username or email
    password: str