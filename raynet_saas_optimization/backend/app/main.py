from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .routes import router
from .analytics import analyze_data
from sqlalchemy.orm import Session
import logging
import os
from dotenv import load_dotenv
from fastapi_limiter import FastAPILimiter
import redis.asyncio as redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

# Logging ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS ayarları
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
]

# Add error handling
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"An error occurred: {exc}")
    return {"detail": "Internal Server Error"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API rotalarını ekle ve '/api' prefix'ini kullan
app.include_router(router, prefix="/api")

# Kök endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is running successfully!"}

# Run analysis and initialize cache when application starts
@app.on_event("startup")
async def startup_event():
    background_tasks = BackgroundTasks()
    background_tasks.add_task(analyze_data, SessionLocal())
    
    redis_client = redis.from_url("redis://localhost", encoding="utf8", decode_responses=True)
    
    # FastAPICache'i Redis backend ile başlat
    FastAPICache.init(RedisBackend(redis_client), prefix="fastapi-cache")

    # Rate Limiting için FastAPILimiter başlat
    await FastAPILimiter.init(redis_client)
# Ana uygulamada da .env dosyasını yükleyin
load_dotenv()

# Environment değişkenlerini kontrol edin
print("Environment variables:")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")

