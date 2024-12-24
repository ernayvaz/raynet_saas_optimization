import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os
import logging

# Loglama yapılandırması
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("update_licenses.log"),
        logging.StreamHandler()
    ]
)

# .env dosyasını yükle
load_dotenv()

# PostgreSQL bağlantı bilgileri
try:
    conn = psycopg2.connect(
        host="localhost",
        dbname="raynet_db",
        user="postgres",
        password=os.getenv("POSTGRES_PASSWORD")
    )
    cursor = conn.cursor()
    logging.info("PostgreSQL bağlantısı başarılı.")
except Exception as e:
    logging.error(f"PostgreSQL bağlantısı kurulamadı: {e}")
    exit(1)

# Güncel lisans verilerini tanımlama (örnek)
licenses = [
    {
        'license_id': 'MICROSOFT_TEAMS_FREE',
        'license_name': 'Microsoft Teams (Free)',
        'cost_per_user': 0.00,
        'vendor_support_ends_at': None,
        'vendor_name': 'Microsoft'
    },
    {
        'license_id': 'M365_BUSINESS_STANDARD',
        'license_name': 'M365 Business Standard',
        'cost_per_user': 12.50,
        'vendor_support_ends_at': '2025-12-31',
        'vendor_name': 'Microsoft'
    },
    {
        'license_id': 'M365_BUSINESS_PREMIUM',
        'license_name': 'M365 Business Premium',
        'cost_per_user': 15.00,
        'vendor_support_ends_at': '2025-12-31',
        'vendor_name': 'Microsoft'
    },
    {
        'license_id': 'M365_E3',
        'license_name': 'M365 E3',
        'cost_per_user': 20.00,
        'vendor_support_ends_at': '2026-12-31',
        'vendor_name': 'Microsoft'
    },
    {
        'license_id': 'M365_E5',
        'license_name': 'M365 E5',
        'cost_per_user': 25.00,
        'vendor_support_ends_at': '2026-12-31',
        'vendor_name': 'Microsoft'
    },
    {
        'license_id': 'M365_BUSINESS_BASIC',
        'license_name': 'M365 Business Basic',
        'cost_per_user': 10.00,
        'vendor_support_ends_at': '2025-12-31',
        'vendor_name': 'Microsoft'
    },
    {
        'license_id': 'GOOGLE_WORKSPACE_BASIC',
        'license_name': 'Google Workspace Basic',
        'cost_per_user': 8.00,
        'vendor_support_ends_at': '2025-12-31',
        'vendor_name': 'Google'
    },
    {
        'license_id': 'GOOGLE_WORKSPACE_BUSINESS',
        'license_name': 'Google Workspace Business',
        'cost_per_user': 12.00,
        'vendor_support_ends_at': '2025-12-31',
        'vendor_name': 'Google'
    },
    {
        'license_id': 'AMAZON_WORKSPACES_STANDARD',
        'license_name': 'Amazon WorkSpaces Standard',
        'cost_per_user': 9.50,
        'vendor_support_ends_at': '2025-12-31',
        'vendor_name': 'Amazon'
    },
    {
        'license_id': 'AMAZON_WORKSPACES_PERFORMANCE',
        'license_name': 'Amazon WorkSpaces Performance',
        'cost_per_user': 14.00,
        'vendor_support_ends_at': '2026-12-31',
        'vendor_name': 'Amazon'
    }
]

# Vendor bilgilerini ekleme veya güncelleme
vendors = set([license['vendor_name'] for license in licenses if license['vendor_name']])

for vendor in vendors:
    try:
        cursor.execute("""
            INSERT INTO vendors (vendor_name) VALUES (%s)
            ON CONFLICT (vendor_name) DO NOTHING;
        """, (vendor,))
        logging.info(f"Vendor eklendi veya zaten mevcut: {vendor}")
    except Exception as e:
        logging.error(f"Error occurred while adding vendor: {vendor}. Error: {e}")

# Licenses tablosunu güncelleme
for license in licenses:
    try:
        # Vendor_id'yi almak
        cursor.execute("""
            SELECT vendor_id FROM vendors WHERE vendor_name = %s;
        """, (license['vendor_name'],))
        vendor_id = cursor.fetchone()
        vendor_id = vendor_id[0] if vendor_id else None

        cursor.execute("""
            INSERT INTO licenses (license_id, license_name, cost_per_user, vendor_support_ends_at, vendor_id)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (license_id) DO UPDATE
            SET
                license_name = EXCLUDED.license_name,
                cost_per_user = EXCLUDED.cost_per_user,
                vendor_support_ends_at = EXCLUDED.vendor_support_ends_at,
                vendor_id = EXCLUDED.vendor_id;
        """, (
            license['license_id'],
            license['license_name'],
            license['cost_per_user'],
            license['vendor_support_ends_at'],
            vendor_id
        ))
        logging.info(f"License added or updated: {license['license_id']}")
    except Exception as e:
        logging.error(f"Error occurred while adding/updating license: {license['license_id']}. Error: {e}")

# Değişiklikleri kaydetme ve bağlantıyı kapatma
try:
    conn.commit()
    logging.info("All licenses successfully saved to database.")
except Exception as e:
    logging.error(f"Error occurred while saving changes: {e}")
finally:
    cursor.close()
    conn.close()
    logging.info("PostgreSQL bağlantısı kapatıldı.")