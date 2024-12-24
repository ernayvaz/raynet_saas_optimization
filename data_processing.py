import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import json
import os

# Database connection information
DB_USERNAME = 'postgres'  # Your PostgreSQL username
DB_PASSWORD = '27101992'  # PostgreSQL password
DB_HOST = 'localhost'  # Database server (usually localhost)
DB_PORT = '5432'  # PostgreSQL default port
DB_NAME = 'raynet_prototip'  # Your database name

# PostgreSQL connection string
DATABASE_URL = f'postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
# SQLAlchemy to connect to database
engine = create_engine(DATABASE_URL)

# Read data from raw_data table
def get_raw_data():
    query = 'SELECT * FROM raw_data ORDER BY fetched_at DESC LIMIT 1;'
    df = pd.read_sql(query, engine)
    if df.empty:
        print("No data in raw_data table.")
        return None
    return df.iloc[0]['raw_json']

# Process data and add to normalized tables
def process_data(raw_json):
    data = json.loads(raw_json)
    
    # Add users
    users = []
    for user in data.get('users', []):
        users.append({
            'user_id': user['id'],
            'email': user['email'],
            'department': user.get('department', 'Unknown'),
            'status': user['status']
        })
    if users:
        users_df = pd.DataFrame(users)
        users_df.to_sql('users', engine, if_exists='append', index=False)
        print(f"{len(users_df)} users added.")

    # Add licenses
    licenses = []
    for sku in data.get('subscribedSkus', []):
        licenses.append({
            'license_id': sku['skuId'],
            'license_name': sku['skuPartNumber'],
            'cost_per_user': sku['prepaidUnits']['enabled'],  # Make sure you're using the correct field here
            'vendor_support_ends_at': None  # Optional, add if needed
        })
    if licenses:
        licenses_df = pd.DataFrame(licenses).drop_duplicates(subset=['license_id'])
        licenses_df.to_sql('licenses', engine, if_exists='append', index=False)
        print(f"{len(licenses_df)} licenses added.")

    # Add user-license relationships
    user_licenses = []
    for user_license in data.get('userLicenses', []):
        user_licenses.append({
            'user_id': user_license['userId'],
            'license_id': user_license['skuId'],
            'assigned_at': pd.to_datetime(user_license['assignedAt']),
            'last_active_at': pd.to_datetime(user_license.get('lastActiveAt', pd.NaT))
        })
    if user_licenses:
        user_licenses_df = pd.DataFrame(user_licenses)
        user_licenses_df.to_sql('user_licenses', engine, if_exists='append', index=False)
        print(f"{len(user_licenses_df)} user-license relationships added.")

    # Add usage statistics
    usage_stats = []
    for report in data.get('usageStats', []):  # Make sure the 'usageStats' field is correct
        usage_stats.append({
            'user_id': report['userId'],
            'license_id': report['licenseId'],
            'date': pd.to_datetime(report['date']).date(),
            'active_minutes': report['activeMinutes'],
            'login_count': report['loginCount']
        })
    if usage_stats:
        usage_stats_df = pd.DataFrame(usage_stats)
        usage_stats_df.to_sql('usage_stats', engine, if_exists='append', index=False)
        print(f"{len(usage_stats_df)} usage statistics added.")

    # Add optimization recommendations (Optional)
    optimizations = []
    for opt in data.get('optimizations', []):  # Make sure the 'optimizations' field is correct
        optimizations.append({
            'user_id': opt.get('userId'),
            'license_id': opt.get('licenseId'),
            'recommendation_text': opt['recommendationText'],
            'created_at': pd.to_datetime(opt.get('createdAt', pd.Timestamp.now()))
        })
    if optimizations:
        optimizations_df = pd.DataFrame(optimizations)
        optimizations_df.to_sql('optimizations', engine, if_exists='append', index=False)
        print(f"{len(optimizations_df)} optimization recommendations added.")

def main():
    raw_json = get_raw_data()
    if raw_json:
        process_data(raw_json)

if __name__ == "__main__":
    main()
