from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .routes import router
from .analytics import analyze_data
from sqlalchemy.orm import Session
import logging

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
def startup_event():
    logger.info("Uygulama başlatılıyor...")
    db: Session = SessionLocal()
    try:
        analyze_data(db)
    finally:
        db.close()
    logger.info("Analiz tamamlandı.")

    # Tüm route'ları listeleme (Debug amacıyla)
    print("Registered routes:")
    for route in app.routes:
        print(f"Path: {route.path}, Name: {route.name}")
