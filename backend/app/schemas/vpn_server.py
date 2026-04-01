from typing import Optional
from pydantic import BaseModel, Field

class VPNServer(BaseModel):
    id: int
    hostname: str
    ip_address: str
    score: int
    ping: int
    speed: int
    country: str
    country_code: str
    sessions: int
    uptime: Optional[int] = None

    class Config:
        from_attributes = True

class VPNServerList(BaseModel):
    servers: list[VPNServer]
    total: int
    page: int = 1
    page_size: int = 20
