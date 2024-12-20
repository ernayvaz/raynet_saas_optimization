import psycopg2
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

# PostgreSQL bağlantı bilgileri
conn = psycopg2.connect(
    host="localhost",
    dbname="raynet_db",
    user="postgres",
    password=os.getenv("POSTGRES_PASSWORD")  # Çevresel değişken olarak kullanılır
)
cursor = conn.cursor()

# raw_data tablosundan tüm verileri çek
cursor.execute("SELECT fetched_at, raw_json FROM raw_data")
raw_records = cursor.fetchall()

for record in raw_records:
    fetched_at, raw_json = record
    data = raw_json  # raw_json zaten bir dict olduğu için json.loads kullanmaya gerek yok

    # Verinin hangi anahtarları içerdiğini görmek için print ekleyin
    print("Veri Anahtarları:", data.keys())

    # Kullanıcı bilgilerini çekme
    user_id = data.get('User Principal Name')
    email = data.get('User Principal Name')  # Eğer email farklı bir alandan geliyorsa burada düzeltin
    department = None  # API yanıtında departman bilgisi yok, manuel ekleme gerekebilir
    is_deleted_str = data.get('Is Deleted', 'False').strip().lower()
    status = 'inactive' if is_deleted_str == 'true' else 'active'

    # Kullanıcıyı users tablosuna ekleme
    cursor.execute(
        """
        INSERT INTO users (user_id, email, department, status) 
        VALUES (%s, %s, %s, %s) 
        ON CONFLICT (user_id) DO NOTHING
        """,
        (user_id, email, department, status)
    )

    # Lisans bilgilerini çekme
    license_id = data.get('Assigned Products')
    license_name = data.get('Assigned Products')  # Daha detaylı isimlendirme gerekebilir
    cost_per_user = 0  # Maliyet bilgisi API yanıtında yok, manuel ekleme gerekebilir
    vendor_support_ends_at = None  # Opsiyonel

    # Lisansı licenses tablosuna ekleme
    cursor.execute(
        """
        INSERT INTO licenses (license_id, license_name, cost_per_user, vendor_support_ends_at) 
        VALUES (%s, %s, %s, %s) 
        ON CONFLICT (license_id) DO NOTHING
        """,
        (license_id, license_name, cost_per_user, vendor_support_ends_at)
    )

    # Kullanıcının lisansını user_licenses tablosuna ekleme
    # Farklı lisans türleri için atama tarihlerini kontrol etme
    license_assign_date = (
        data.get('Exchange License Assign Date') or
        data.get('OneDrive License Assign Date') or
        data.get('SharePoint License Assign Date') or
        data.get('Skype For Business License Assign Date') or
        data.get('Yammer License Assign Date') or
        data.get('Teams License Assign Date')
    )

    if license_assign_date:
        try:
            assigned_at = datetime.strptime(license_assign_date, '%Y-%m-%d')
        except ValueError:
            assigned_at = None  # Tarih formatı yanlışsa None olarak ayarla
            print(f"Warning: Incorrect date format for License Assign Date: {license_assign_date}")
    else:
        assigned_at = None  # Anahtar yoksa None olarak ayarla

    # 'Exchange Last Activity Date' anahtarını kontrol edin
    exchange_last_activity_date = data.get('Exchange Last Activity Date')
    if exchange_last_activity_date:
        try:
            last_active_at = datetime.strptime(exchange_last_activity_date, '%Y-%m-%d')
        except ValueError:
            last_active_at = None  # Tarih formatı yanlışsa None olarak ayarla
            print(f"Warning: Incorrect date format for Exchange Last Activity Date: {exchange_last_activity_date}")
    else:
        last_active_at = None  # Anahtar yoksa None olarak ayarla

    cursor.execute(
        """
        INSERT INTO user_licenses (user_id, license_id, assigned_at, last_active_at) 
        VALUES (%s, %s, %s, %s) 
        ON CONFLICT DO NOTHING
        """,
        (user_id, license_id, assigned_at, last_active_at)
    )

    # Kullanım istatistiklerini usage_stats tablosuna ekleme
    report_refresh_date = data.get('Report Refresh Date')
    if report_refresh_date:
        try:
            date = datetime.strptime(report_refresh_date, '%Y-%m-%d').date()
        except ValueError:
            date = None  # Tarih formatı yanlışsa None olarak ayarla
            print(f"Warning: Incorrect date format for Report Refresh Date: {report_refresh_date}")
    else:
        date = None  # Anahtar yoksa None olarak ayarla

    active_minutes = 0  # API yanıtında aktif dakika bilgisi yok, manuel ekleme gerekebilir
    login_count = 0  # API yanıtında oturum sayısı bilgisi yok, manuel ekleme gerekebilir

    cursor.execute(
        """
        INSERT INTO usage_stats (user_id, license_id, date, active_minutes, login_count) 
        VALUES (%s, %s, %s, %s, %s) 
        ON CONFLICT DO NOTHING
        """,
        (user_id, license_id, date, active_minutes, login_count)
    )

# Değişiklikleri kaydetme ve bağlantıyı kapatma
conn.commit()
print('Data normalization and enrichment completed.')

cursor.close()
conn.close()


# TERMINAL - python normalize_data.py