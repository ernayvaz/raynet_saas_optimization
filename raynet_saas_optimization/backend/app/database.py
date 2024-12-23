from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# password.env dosyasını yükle
load_dotenv("password.env")

# Database URL'yi password.env'den al
DATABASE_URL = "postgresql://postgres:27101992@localhost/raynet_db"

print(f"Using Database URL: {DATABASE_URL}")

# Engine oluştur
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Production'da False olmalı
    pool_size=20,
    max_overflow=20,
    pool_timeout=60,
    pool_pre_ping=True,  # Bağlantı sağlığını kontrol et
    pool_recycle=3600  # Eklendi
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
