# backend/app/schemas.py

from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime, date

class RawDataBase(BaseModel):
    fetched_at: datetime
    raw_json: str

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    user_id: str
    email: EmailStr
    department: Optional[str] = None
    status: str

    @validator('status')
    def status_must_be_valid(cls, v):
        valid_statuses = ['active', 'inactive', 'suspended']
        if v.lower() not in valid_statuses:
            raise ValueError('Invalid status')
        return v.lower()

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    pass

class User(UserBase):
    pass

class LicenseBase(BaseModel):
    license_id: str
    license_name: str
    cost_per_user: float
    vendor_support_ends_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class LicenseCreate(LicenseBase):
    pass

class License(LicenseBase):
    pass

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
    created_at: datetime

    class Config:
        orm_mode = True

class OptimizationCreate(OptimizationBase):
    pass

class Optimization(OptimizationBase):
    pass
