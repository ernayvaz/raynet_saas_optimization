# backend/app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas
from fastapi_cache.decorator import cache
from typing import List
from datetime import datetime, timedelta

# User operations
@cache(expire=60)
async def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# License operations
@cache(expire=60)
async def get_licenses(db: Session, skip: int = 0, limit: int = 100) -> List[models.License]:
    return db.query(models.License).offset(skip).limit(limit).all()

def create_license(db: Session, license: schemas.LicenseCreate):
    db_license = models.License(**license.dict())
    db.add(db_license)
    db.commit()
    db.refresh(db_license)
    return db_license

# Usage statistics operations
@cache(expire=60)
async def get_usage_stats(db: Session, skip: int = 0, limit: int = 100) -> List[models.UsageStats]:
    return db.query(models.UsageStats).offset(skip).limit(limit).all()

def create_usage_stat(db: Session, stat: schemas.UsageStatsCreate):
    db_stat = models.UsageStats(**stat.dict())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

# Optimization recommendation operations
@cache(expire=60)
async def get_optimizations(db: Session, skip: int = 0, limit: int = 100) -> List[models.Optimization]:
    return db.query(models.Optimization).offset(skip).limit(limit).all()

def create_optimization(db: Session, optimization: schemas.OptimizationCreate):
    db_optimization = models.Optimization(**optimization.dict())
    db.add(db_optimization)
    db.commit()
    db.refresh(db_optimization)
    return db_optimization

# Analysis operations
async def analyze_data(db: Session):
    # Get usage data for the last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    usage_stats = db.query(models.UsageStats).filter(
        models.UsageStats.date >= thirty_days_ago
    ).all()

    # Analyze usage and create optimization recommendations
    if usage_stats:
        total_minutes = sum(stat.active_minutes for stat in usage_stats)
        avg_minutes = total_minutes / len(usage_stats)

        if avg_minutes < 120:  # Less than 2 hours daily average usage
            optimization = models.Optimization(
                recommendation_text="Low license usage detected. Consider reducing the number of licenses.",
                potential_saving=30
            )
            db.add(optimization)
            db.commit()

    return {"message": "Analysis completed"}
