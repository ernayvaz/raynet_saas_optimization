import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import json
import os

# Veritabanı bağlantı bilgileri
DB_USERNAME = 'postgres'  # PostgreSQL kullanıcı adınız
DB_PASSWORD = '27101992'  # PostgreSQL şifreniz
DB_HOST = 'localhost'  # Veritabanı sunucusu (genellikle localhost)
DB_PORT = '5432'  # PostgreSQL varsayılan portu
DB_NAME = 'raynet_prototip'  # Oluşturduğunuz veritabanı adı

# PostgreSQL bağlantı stringi
DATABASE_URL = f'postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
# SQLAlchemy ile veritabanına bağlanma
engine = create_engine(DATABASE_URL)

# raw_data tablosundaki veriyi okuma
def get_raw_data():
    query = 'SELECT * FROM raw_data ORDER BY fetched_at DESC LIMIT 1;'
    df = pd.read_sql(query, engine)
    if df.empty:
        print("raw_data tablosunda veri yok.")
        return None
    return df.iloc[0]['raw_json']

# Veriyi işleyip normalized tablolara ekleme
def process_data(raw_json):
    data = json.loads(raw_json)
    
    # Kullanıcıları ekleme
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
        print(f"{len(users_df)} kullanıcı eklendi.")

    # Lisansları ekleme
    licenses = []
    for sku in data.get('subscribedSkus', []):
        licenses.append({
            'license_id': sku['skuId'],
            'license_name': sku['skuPartNumber'],
            'cost_per_user': sku['prepaidUnits']['enabled'],  # Burada doğru alanı kullandığınızdan emin olun
            'vendor_support_ends_at': None  # Opsiyonel, ihtiyaç varsa ekleyin
        })
    if licenses:
        licenses_df = pd.DataFrame(licenses).drop_duplicates(subset=['license_id'])
        licenses_df.to_sql('licenses', engine, if_exists='append', index=False)
        print(f"{len(licenses_df)} lisans eklendi.")

    # Kullanıcı Lisans ilişkilerini ekleme
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
        print(f"{len(user_licenses_df)} kullanıcı-lisans ilişkisi eklendi.")

    # Kullanım istatistiklerini ekleme
    usage_stats = []
    for report in data.get('usageStats', []):  # 'usageStats' alanının doğru olduğundan emin olun
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
        print(f"{len(usage_stats_df)} kullanım istatistiği eklendi.")

    # Optimizasyon önerilerini ekleme (Opsiyonel)
    optimizations = []
    for opt in data.get('optimizations', []):  # 'optimizations' alanının doğru olduğundan emin olun
        optimizations.append({
            'user_id': opt.get('userId'),
            'license_id': opt.get('licenseId'),
            'recommendation_text': opt['recommendationText'],
            'created_at': pd.to_datetime(opt.get('createdAt', pd.Timestamp.now()))
        })
    if optimizations:
        optimizations_df = pd.DataFrame(optimizations)
        optimizations_df.to_sql('optimizations', engine, if_exists='append', index=False)
        print(f"{len(optimizations_df)} optimizasyon önerisi eklendi.")

def main():
    raw_json = get_raw_data()
    if raw_json:
        process_data(raw_json)

if __name__ == "__main__":
    main()
