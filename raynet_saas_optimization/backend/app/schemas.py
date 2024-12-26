# backend/app/schemas.py

from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime, date

class RawDataBase(BaseModel):
    fetched_at: datetime
    raw_json: str

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str
    department: Optional[str] = None
    status: str

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    user_id: str

class User(UserBase):
    user_id: str

class LicenseBase(BaseModel):
    license_name: str
    cost_per_user: float
    vendor_support_ends_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class LicenseCreate(LicenseBase):
    license_id: str

class License(LicenseBase):
    license_id: str

class UserLicenseBase(BaseModel):
    user_id: str
    license_id: str
    assigned_at: datetime
    last_active_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserLicenseCreate(UserLicenseBase):
    pass

class UserLicense(UserLicenseBase):
    pass

class UsageStatsBase(BaseModel):
    user_id: str
    license_id: str
    date: date
    active_minutes: int
    login_count: int

    class Config:
        orm_mode = True

class UsageStatsCreate(UsageStatsBase):
    pass

class UsageStats(UsageStatsBase):
    pass

class OptimizationBase(BaseModel):
    user_id: Optional[str] = None
    license_id: Optional[str] = None
    recommendation_text: str
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class OptimizationCreate(OptimizationBase):
    pass

class Optimization(OptimizationBase):
    id: int
