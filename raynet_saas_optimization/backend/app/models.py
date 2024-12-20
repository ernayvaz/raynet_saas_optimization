from sqlalchemy import Column, String, Integer, Boolean, Date, ForeignKey, TIMESTAMP, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class RawData(Base):
    __tablename__ = "raw_data"
    id = Column(Integer, primary_key=True, index=True)
    fetched_at = Column(TIMESTAMP(timezone=True), nullable=False)
    raw_json = Column(String, nullable=False)

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, index=True)
    email = Column(String, nullable=False)
    department = Column(String, nullable=True)
    status = Column(String, nullable=False)
    licenses = relationship("UserLicense", back_populates="user")

class License(Base):
    __tablename__ = "licenses"
    license_id = Column(String, primary_key=True, index=True)
    license_name = Column(String, nullable=False)
    cost_per_user = Column(Numeric(10, 2), nullable=False)
    vendor_support_ends_at = Column(TIMESTAMP(timezone=True), nullable=True)
    vendor_id = Column(Integer, nullable=True)  # Yeni sütun eklendi
    users = relationship("UserLicense", back_populates="license")

class UserLicense(Base):
    __tablename__ = "user_licenses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    license_id = Column(String, ForeignKey("licenses.license_id"))
    assigned_at = Column(TIMESTAMP(timezone=True), nullable=False)
    last_active_at = Column(TIMESTAMP(timezone=True), nullable=True)
    platform_id = Column(String, nullable=True)  # Yeni sütun eklendi
    cluster = Column(Integer, nullable=True)     # Yeni sütun eklendi
    user = relationship("User", back_populates="licenses")
    license = relationship("License", back_populates="users")

class UsageStats(Base):
    __tablename__ = "usage_stats"
    user_id = Column(String, ForeignKey("users.user_id"), primary_key=True)
    license_id = Column(String, ForeignKey("licenses.license_id"), primary_key=True)
    date = Column(Date, primary_key=True)
    active_minutes = Column(Integer, nullable=False)  # Numeric yerine Integer kullanıldı
    login_count = Column(Integer, nullable=False)     # Numeric yerine Integer kullanıldı
    user = relationship("User")
    license = relationship("License")

class Optimization(Base):
    __tablename__ = "optimizations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=True)
    license_id = Column(String, ForeignKey("licenses.license_id"), nullable=True)
    recommendation_text = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

    __table_args__ = (UniqueConstraint('user_id', 'license_id', name='unique_user_license'),)
