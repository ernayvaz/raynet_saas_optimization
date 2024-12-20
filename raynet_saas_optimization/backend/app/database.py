from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
import ctypes

# libpq.dll'in tam yolu (Windows için)
# ctypes.WinDLL(r"C:\Program Files\PostgreSQL\17\bin\libpq.dll")

# .env dosyasını yükle
load_dotenv(dotenv_path="C:/Users/erena/Desktop/Raynet Projects/SaaS Prototype/raynet_saas_optimization/backend/password.env")

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}") 

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
