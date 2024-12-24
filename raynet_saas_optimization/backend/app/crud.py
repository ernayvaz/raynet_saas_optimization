# backend/app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas
from fastapi_cache.decorator import cache
from typing import List
from datetime import datetime, timedelta

# Kullanıcı işlemleri
@cache(expire=60)
async def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Lisans işlemleri
@cache(expire=60)
async def get_licenses(db: Session, skip: int = 0, limit: int = 100) -> List[models.License]:
    return db.query(models.License).offset(skip).limit(limit).all()

def create_license(db: Session, license: schemas.LicenseCreate):
    db_license = models.License(**license.dict())
    db.add(db_license)
    db.commit()
    db.refresh(db_license)
    return db_license

# Kullanım istatistikleri işlemleri
@cache(expire=60)
async def get_usage_stats(db: Session, skip: int = 0, limit: int = 100) -> List[models.UsageStats]:
    return db.query(models.UsageStats).offset(skip).limit(limit).all()

def create_usage_stat(db: Session, stat: schemas.UsageStatsCreate):
    db_stat = models.UsageStats(**stat.dict())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

# Optimizasyon önerileri işlemleri
@cache(expire=60)
async def get_optimizations(db: Session, skip: int = 0, limit: int = 100) -> List[models.Optimization]:
    return db.query(models.Optimization).offset(skip).limit(limit).all()

def create_optimization(db: Session, optimization: schemas.OptimizationCreate):
    db_optimization = models.Optimization(**optimization.dict())
    db.add(db_optimization)
    db.commit()
    db.refresh(db_optimization)
    return db_optimization

# Analiz işlemleri
async def analyze_data(db: Session):
    # Son 30 günlük kullanım verilerini al
    thirty_days_ago = datetime.now() - timedelta(days=30)
    usage_stats = db.query(models.UsageStats).filter(
        models.UsageStats.date >= thirty_days_ago
    ).all()

    # Kullanım analizi yap ve optimizasyon önerileri oluştur
    if usage_stats:
        total_minutes = sum(stat.active_minutes for stat in usage_stats)
        avg_minutes = total_minutes / len(usage_stats)

        if avg_minutes < 120:  # Günlük ortalama 2 saatten az kullanım
            optimization = models.Optimization(
                recommendation_text="Lisans kullanımı düşük. Lisans sayısını azaltmayı düşünebilirsiniz.",
                potential_saving=30
            )
            db.add(optimization)
            db.commit()

    return {"message": "Analiz tamamlandı"}
