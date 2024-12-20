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
        logging.FileHandler("update_users.log"),
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

# Güncel kullanıcı verilerini tanımlama (örnek)
users = [
    {
        'user_id': '732056B31AF3AF8D3F8037B527D395FD',
        'email': 'john.doe@example.com',
        'department': 'IT',
        'status': 'active'
    },
    {
        'user_id': '1234567890ABCDEF1234567890ABCDEF',
        'email': 'jane.smith@example.com',
        'department': 'Marketing',
        'status': 'active'
    },
    {
        'user_id': 'ABCDEF1234567890ABCDEF1234567890',
        'email': 'alice.jones@example.com',
        'department': 'Sales',
        'status': 'inactive'
    },
    {
        'user_id': 'FEDCBA0987654321FEDCBA0987654321',
        'email': 'bob.brown@example.com',
        'department': 'HR',
        'status': 'active'
    },
    {
        'user_id': '0A1B2C3D4E5F67890123456789ABCDEF',
        'email': 'charlie.black@example.com',
        'department': 'Finance',
        'status': 'inactive'
    },
    {
        'user_id': '1A2B3C4D5E6F7890123456789ABCDEF0',
        'email': 'diana.white@example.com',
        'department': 'IT',
        'status': 'active'
    },
    {
        'user_id': '9F8E7D6C5B4A3210123456789ABCDEF0',
        'email': 'edward.green@example.com',
        'department': 'Marketing',
        'status': 'inactive'
    },
    {
        'user_id': '8E7D6C5B4A321098765432109ABCDEF0',
        'email': 'fiona.red@example.com',
        'department': 'Sales',
        'status': 'active'
    },
    {
        'user_id': '7D6C5B4A321098765432109ABCDEF000',
        'email': 'george.blue@example.com',
        'department': 'HR',
        'status': 'inactive'
    },
    {
        'user_id': '6C5B4A321098765432109ABCDEF0001A',
        'email': 'helen.yellow@example.com',
        'department': 'Finance',
        'status': 'active'
    }
]

# Users tablosunu güncelleme veya ekleme
for user in users:
    try:
        cursor.execute("""
            INSERT INTO users (user_id, email, department, status)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET
                email = EXCLUDED.email,
                department = EXCLUDED.department,
                status = EXCLUDED.status;
        """, (
            user['user_id'],
            user['email'],
            user['department'],
            user['status']
        ))
        logging.info(f"User eklendi veya güncellendi: {user['user_id']}")
    except Exception as e:
        logging.error(f"User eklenirken/güncellenirken hata oluştu: {user['user_id']}. Hata: {e}")

# Değişiklikleri kaydetme ve bağlantıyı kapatma
try:
    conn.commit()
    logging.info("Tüm kullanıcılar başarıyla veritabanına kaydedildi.")
except Exception as e:
    logging.error(f"Değişiklikler kaydedilirken hata oluştu: {e}")
finally:
    cursor.close()
    conn.close()
    logging.info("PostgreSQL bağlantısı kapatıldı.")
