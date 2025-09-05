from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from jose import jwt, JWTError

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

def auth_middleware(cookie_name: str):
    async def verify_user(request: Request):
        token = request.cookies.get(cookie_name)
        if not token:
            raise HTTPException(status_code=402, detail="Unauthorized")

        try:
            # ✅ FIXED: pass token first, then secret
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

            user = {**payload}
            user.pop("password", None)

            return user
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

    return verify_user
