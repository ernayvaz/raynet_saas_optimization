# backend/app/routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import RawData, User, License, UserLicense, UsageStats, Optimization
from .schemas import (
    RawDataBase,
    User,
    UserCreate,
    License,
    LicenseCreate,
    UserLicense,
    UserLicenseCreate,
    UsageStats,
    UsageStatsCreate,
    Optimization,
    OptimizationCreate
)
from .crud import (
    get_users,
    get_user,
    create_user,
    get_licenses,
    get_license,
    create_license,
    get_usage_stats,
    get_optimizations
)
import json

router = APIRouter()

@router.get("/")
def read_api_root():
    return {"message": "Raynet SaaS Optimization API"}

# Veritabanı oturumu almak için bağımlılık
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/test")
def test_api():
    return {"message": "Test endpoint çalışıyor!"}


@router.post("/ingest_raw_data/", response_model=RawDataBase)
def ingest_raw_data(raw_data: RawDataBase, db: Session = Depends(get_db)):
    db_raw = RawData(fetched_at=raw_data.fetched_at, raw_json=raw_data.raw_json)
    db.add(db_raw)
    db.commit()
    db.refresh(db_raw)
    return db_raw

@router.get("/users/", response_model=list[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = get_users(db, skip=skip, limit=limit)
    return users

@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    user = get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users/", response_model=User)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id=user.user_id)
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    return create_user(db, user=user)

@router.get("/licenses/", response_model=list[License])
def read_licenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    licenses = get_licenses(db, skip=skip, limit=limit)
    return licenses

@router.get("/licenses/{license_id}", response_model=License)
def read_license(license_id: str, db: Session = Depends(get_db)):
    license = get_license(db, license_id=license_id)
    if license is None:
        raise HTTPException(status_code=404, detail="License not found")
    return license

@router.post("/licenses/", response_model=License)
def create_new_license(license: LicenseCreate, db: Session = Depends(get_db)):
    db_license = get_license(db, license_id=license.license_id)
    if db_license:
        raise HTTPException(status_code=400, detail="License already exists")
    return create_license(db, license=license)

@router.get("/usage_stats/", response_model=list[UsageStats])
def read_usage_stats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    usage_stats = get_usage_stats(db, skip=skip, limit=limit)
    return usage_stats

@router.get("/optimizations/", response_model=list[Optimization])
def read_optimizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    optimizations = get_optimizations(db, skip=skip, limit=limit)
    return optimizations
