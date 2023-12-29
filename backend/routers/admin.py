from fastapi import (APIRouter)
import os


router = APIRouter(tags=["ADMIN LOGIN"])

@router.post("/api/admin/login/")
async def admin_login(
        body: dict
    ):
    if body["pwd"] == os.environ.get("SQL_PASS"):
        return {"Token": os.environ.get("GALLERY_API_ACCESS_TOKEN")}
    else:
        return {"Error": "Invalid password."}