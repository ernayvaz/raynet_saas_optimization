# backend/app/routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, schemas, models
from .database import SessionLocal, get_db

router = APIRouter()

@router.get("/")
def read_api_root():
    return {"message": "Raynet SaaS Optimization API"}

# Get database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/test")
def test_api():
    return {"message": "Test endpoint çalışıyor!"}


@router.post("/ingest_raw_data/", response_model=schemas.RawDataBase)
def ingest_raw_data(raw_data: schemas.RawDataBase, db: Session = Depends(get_db)):
    db_raw = RawData(fetched_at=raw_data.fetched_at, raw_json=raw_data.raw_json)
    db.add(db_raw)
    db.commit()
    db.refresh(db_raw)
    return db_raw

@router.get("/users/", response_model=List[schemas.User])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        users = await crud.get_users(db, skip=skip, limit=limit)
        print(f"Successfully fetched {len(users)} users")
        return [schemas.User.from_orm(user) for user in users]
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    user = get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@router.get("/licenses/", response_model=List[schemas.License])
async def read_licenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        licenses = await crud.get_licenses(db, skip=skip, limit=limit)
        print(f"Successfully fetched {len(licenses)} licenses")
        result = []
        for license in licenses:
            try:
                license_data = schemas.License.from_orm(license)
                result.append(license_data)
            except Exception as e:
                print(f"Error converting license {license.license_id}: {str(e)}")
                # Skip invalid licenses instead of failing the entire request
                continue
        return result
    except Exception as e:
        print(f"Error fetching licenses: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/licenses/{license_id}", response_model=schemas.License)
def read_license(license_id: str, db: Session = Depends(get_db)):
    license = get_license(db, license_id=license_id)
    if license is None:
        raise HTTPException(status_code=404, detail="License not found")
    return license

@router.post("/licenses/", response_model=schemas.License)
def create_license(license: schemas.LicenseCreate, db: Session = Depends(get_db)):
    return crud.create_license(db=db, license=license)

@router.get("/usage_stats/", response_model=List[schemas.UsageStats])
async def read_usage_stats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        stats = await crud.get_usage_stats(db, skip=skip, limit=limit)
        print(f"Successfully fetched {len(stats)} usage stats")
        return [schemas.UsageStats.from_orm(stat) for stat in stats]
    except Exception as e:
        print(f"Error fetching usage stats: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/usage_stats/", response_model=schemas.UsageStats)
def create_usage_stat(stat: schemas.UsageStatsCreate, db: Session = Depends(get_db)):
    return crud.create_usage_stat(db=db, stat=stat)

@router.get("/optimizations/", response_model=List[schemas.Optimization])
async def read_optimizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        optimizations = await crud.get_optimizations(db, skip=skip, limit=limit)
        print(f"Successfully fetched {len(optimizations)} optimizations")
        return [schemas.Optimization.from_orm(opt) for opt in optimizations]
    except Exception as e:
        print(f"Error fetching optimizations: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimizations/", response_model=schemas.Optimization)
def create_optimization(optimization: schemas.OptimizationCreate, db: Session = Depends(get_db)):
    return crud.create_optimization(db=db, optimization=optimization)
