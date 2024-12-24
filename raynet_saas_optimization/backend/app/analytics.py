from sqlalchemy.orm import Session, aliased
from sqlalchemy import or_
from .models import User, License, UserLicense, Optimization
from datetime import datetime, timedelta

def analyze_data(db: Session):
    print("Starting data analysis...")
    
    # Current date
    current_date = datetime.now().date()
    print(f"Current date: {current_date}")
    
    # Find users who have not been active for more than 30 days
    threshold_date = current_date - timedelta(days=30)
    print(f"Threshold date: {threshold_date}")
    
    # Aliased tables to make JOIN operations clearer
    ul = aliased(UserLicense)
    l = aliased(License)
    
    try:
        inactive_users = (
            db.query(User, ul, l)
            .select_from(User)
            .join(ul, User.user_id == ul.user_id)
            .join(l, ul.license_id == l.license_id)
            .filter(or_(ul.last_active_at < threshold_date, ul.last_active_at.is_(None)))
            .options(
                selectinload(User.licenses),
                selectinload(License.users)
            )
            .all()
        )
        print(f"Found {len(inactive_users)} inactive users.")
    except Exception as e:
        print(f"Error during query: {e}")
        raise
    
    # Set to store unique (user_id, license_id) pairs
    processed_pairs = set()
    
    for user, user_license, license in inactive_users:
        pair = (user.user_id, license.license_id)
        
        if pair in processed_pairs:
            print(f"Already processed optimization for user: {user.email}, license: {license.license_name}")
            continue
        
        # Check if optimization already exists
        existing_optimization = db.query(Optimization).filter(
            Optimization.user_id == user.user_id,
            Optimization.license_id == license.license_id
        ).first()
        
        if existing_optimization:
            print(f"Optimization already exists for user: {user.email}, license: {license.license_name}")
            processed_pairs.add(pair)
            continue  # Skip if optimization already exists
        
        # Create optimization recommendation
        recommendation_text = f"User {user.email} has not been active for over 30 days. Consider downgrading their {license.license_name} license to reduce costs."
        print(f"Creating optimization for user: {user.email}, license: {license.license_name}")
        
        # Add optimization recommendation to database
        optimization = Optimization(
            user_id=user.user_id,
            license_id=license.license_id,
            recommendation_text=recommendation_text,
            created_at=datetime.now()
        )
        db.add(optimization)
        processed_pairs.add(pair)
    
    try:
        db.commit()
        print('Analytics completed and optimization suggestions generated.')
    except Exception as e:
        db.rollback()
        print(f"Error during commit: {e}")
        raise
