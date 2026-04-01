from fastapi import APIRouter
from app.api.v1.endpoints import servers

api_router = APIRouter()
api_router.include_router(servers.router, prefix="/servers", tags=["servers"])
