# backend/app/crud.py

from sqlalchemy.orm import Session
from .models import User, License, UserLicense, UsageStats, Optimization
from .schemas import UserCreate, LicenseCreate, UserLicenseCreate, UsageStatsCreate, OptimizationCreate

# Kullanıcı CRUD İşlemleri
def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        user_id=user.user_id,
        email=user.email,
        department=user.department,
        status=user.status
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Lisans CRUD İşlemleri
def get_license(db: Session, license_id: str):
    return db.query(License).filter(License.license_id == license_id).first()

def get_licenses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(License).offset(skip).limit(limit).all()

def create_license(db: Session, license: LicenseCreate):
    db_license = License(
        license_id=license.license_id,
        license_name=license.license_name,
        cost_per_user=license.cost_per_user,
        vendor_support_ends_at=license.vendor_support_ends_at
    )
    db.add(db_license)
    db.commit()
    db.refresh(db_license)
    return db_license

# Kullanım İstatistikleri CRUD İşlemleri
def get_usage_stats(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UsageStats).offset(skip).limit(limit).all()

# Optimizasyonlar CRUD İşlemleri
def get_optimizations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Optimization).offset(skip).limit(limit).all()

# Diğer modeller için benzer CRUD fonksiyonları ekleyebilirsiniz
