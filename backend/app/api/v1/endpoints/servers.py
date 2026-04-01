import csv
from pathlib import Path
from fastapi import APIRouter, Query, HTTPException
from app.schemas.vpn_server import VPNServer, VPNServerList
from app.core.config import config

router = APIRouter()

def load_servers_from_csv():
    servers = []
    csv_path = Path(config.CSV_DATA_PATH)
    if csv_path.exists():
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader, start=1):
                try:
                    servers.append(VPNServer(
                        id=i,
                        hostname=row.get('hostname', ''),
                        ip_address=row.get('ip_address', ''),
                        score=int(row.get('score', 0)),
                        ping=int(row.get('ping', 0)),
                        speed=int(row.get('speed', 0)),
                        country=row.get('country', ''),
                        country_code=row.get('country_code', ''),
                        sessions=int(row.get('sessions', 0)),
                        uptime=int(row.get('uptime', 0)) if row.get('uptime') else None
                    ))
                except (ValueError, KeyError):
                    continue
    return servers

_servers_cache = None

@router.get("", response_model=VPNServerList)
async def get_servers(
    country: str = Query(None, description="Filter by country code"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    global _servers_cache
    if _servers_cache is None:
        _servers_cache = load_servers_from_csv()
    
    servers = _servers_cache
    if country:
        servers = [s for s in servers if s.country_code.upper() == country.upper()]
    
    total = len(servers)
    start = (page - 1) * page_size
    end = start + page_size
    
    return VPNServerList(
        servers=servers[start:end],
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/countries")
async def get_countries():
    global _servers_cache
    if _servers_cache is None:
        _servers_cache = load_servers_from_csv()
    
    countries = {}
    for server in _servers_cache:
        if server.country_code:
            countries[server.country_code] = server.country
    return {"countries": countries}
