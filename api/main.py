from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import asyncio

app = FastAPI()

# The origin for your GitHub Pages site
origins = [
    "https://lukehollis.github.io",
    "http://localhost:5173", # Also allow local dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HORIZONS_API_URL = "https://ssd.jpl.nasa.gov/api/horizons.api"
HEASARC_API_URL = "https://heasarc.gsfc.nasa.gov/cgi-bin/Tools/convcoord/convcoord.pl"

client = httpx.AsyncClient()

@app.get("/api/horizons")
async def proxy_horizons(request: Request):
    """
    Proxies requests to the JPL Horizons API.
    """
    params = request.query_params
    try:
        req = client.build_request("GET", HORIZONS_API_URL, params=params)
        response = await client.send(req, stream=True)
        return StreamingResponse(response.aiter_raw(), status_code=response.status_code, headers=dict(response.headers))
    except httpx.RequestError as exc:
        raise HTTPException(status_code=500, detail=f"An error occurred while requesting {exc.request.url!r}.")

@app.get("/api/heasarc")
async def proxy_heasarc(request: Request):
    """
    Proxies requests to the HEASARC API.
    """
    params = request.query_params
    try:
        req = client.build_request("GET", HEASARC_API_URL, params=params)
        response = await client.send(req, stream=True)
        return StreamingResponse(response.aiter_raw(), status_code=response.status_code, headers=dict(response.headers))
    except httpx.RequestError as exc:
        raise HTTPException(status_code=500, detail=f"An error occurred while requesting {exc.request.url!r}.")

# To run this server, use the command:
# uvicorn api.main:app --reload
