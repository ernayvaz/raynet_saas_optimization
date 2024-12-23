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
import aioredis

# Logging ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS ayarları
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
]

# Hata yönetimi ekleyin
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"An error occurred: {exc}")
    return {"detail": "Internal Server Error"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    #allow_origins=["http://localhost:3000"],  # React uygulaması URL'sini ekleyin
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

# Uygulama başladığında analizi çalıştır
@app.on_event("startup")
async def startup_event():
    background_tasks = BackgroundTasks()
    background_tasks.add_task(analyze_data, SessionLocal())
    redis = await aioredis.create_redis_pool('redis://localhost')
    await FastAPILimiter.init(redis)

# Ana uygulamada da .env dosyasını yükleyin
load_dotenv()

# Environment değişkenlerini kontrol edin
print("Environment variables:")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
#print(f"DB_USER: {os.getenv('DB_USER')}")
#print(f"DB_HOST: {os.getenv('DB_HOST')}")
