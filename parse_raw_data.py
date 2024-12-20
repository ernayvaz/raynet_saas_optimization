import sys
import psycopg2
import pandas as pd
import json
from dotenv import load_dotenv
import os
from datetime import datetime
import logging

# Loglama yapılandırması
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Log formatını belirleme
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# FileHandler oluşturma ve UTF-8 kodlamasını ayarlama
file_handler = logging.FileHandler('parse_raw_data.log', encoding='utf-8')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# StreamHandler oluşturma ve UTF-8 kodlamasını ayarlama
stream_handler = logging.StreamHandler(sys.stdout)
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

# .env dosyasını yükle
load_dotenv()

# PostgreSQL bağlantı bilgileri
try:
    conn = psycopg2.connect(
        host="localhost",
        dbname="raynet_db",
        user="postgres",
        password=os.getenv("POSTGRES_PASSWORD")  # Çevresel değişken olarak kullanılır
    )
    cursor = conn.cursor()
    logging.info("PostgreSQL bağlantısı başarılı.")
except Exception as e:
    logging.error(f"PostgreSQL bağlantısı kurulamadı: {e}")
    exit(1)

# raw_data tablosundaki tüm kayıtları çekme
try:
    cursor.execute("SELECT id, fetched_at, raw_json FROM raw_data")
    data = cursor.fetchall()
    logging.info("raw_data tablosundan veriler başarıyla çekildi.")
except Exception as e:
    logging.error(f"raw_data tablosundan veriler çekilirken hata oluştu: {e}")
    cursor.close()
    conn.close()
    exit(1)

# Veriyi DataFrame'e dönüştürme
df_raw = pd.DataFrame(data, columns=['id', 'fetched_at', 'raw_json'])

# JSON verisini ayrıştırma ve yapılandırılmış sütunlara dönüştürme
def parse_json(row):
    try:
        json_data = row['raw_json']
        return {
            'fetched_at': pd.to_datetime(row['fetched_at'], format='%d/%m/%Y %H:%M'),
            'is_deleted': json_data.get('Is Deleted', 'False') == 'True',
            'deleted_date': pd.to_datetime(json_data.get('Deleted Date'), errors='coerce') if json_data.get('Deleted Date') else None,
            'display_name': json_data.get('Display Name'),
            'assigned_products': json_data.get('Assigned Products'),
            'has_teams_license': json_data.get('Has Teams License', 'False') == 'True',
            'has_yammer_license': json_data.get('Has Yammer License', 'False') == 'True',
            'report_refresh_date': pd.to_datetime(json_data.get('Report Refresh Date'), errors='coerce') if json_data.get('Report Refresh Date') else None,
            'user_principal_name': json_data.get('User Principal Name'),
            'has_exchange_license': json_data.get('Has Exchange License', 'False') == 'True',
            'has_onedrive_license': json_data.get('Has OneDrive License', 'False') == 'True',
            'has_sharepoint_license': json_data.get('Has SharePoint License', 'False') == 'True',
            'teams_last_activity_date': pd.to_datetime(json_data.get('Teams Last Activity Date'), errors='coerce') if json_data.get('Teams Last Activity Date') else None,
            'teams_license_assign_date': pd.to_datetime(json_data.get('Teams License Assign Date'), errors='coerce') if json_data.get('Teams License Assign Date') else None,
            'yammer_last_activity_date': pd.to_datetime(json_data.get('Yammer Last Activity Date'), errors='coerce') if json_data.get('Yammer Last Activity Date') else None,
            'yammer_license_assign_date': pd.to_datetime(json_data.get('Yammer License Assign Date'), errors='coerce') if json_data.get('Yammer License Assign Date') else None,
            'exchange_last_activity_date': pd.to_datetime(json_data.get('Exchange Last Activity Date'), errors='coerce') if json_data.get('Exchange Last Activity Date') else None,
            'onedrive_last_activity_date': pd.to_datetime(json_data.get('OneDrive Last Activity Date'), errors='coerce') if json_data.get('OneDrive Last Activity Date') else None,
            'exchange_license_assign_date': pd.to_datetime(json_data.get('Exchange License Assign Date'), errors='coerce') if json_data.get('Exchange License Assign Date') else None,
            'onedrive_license_assign_date': pd.to_datetime(json_data.get('OneDrive License Assign Date'), errors='coerce') if json_data.get('OneDrive License Assign Date') else None,
            'sharepoint_last_activity_date': pd.to_datetime(json_data.get('SharePoint Last Activity Date'), errors='coerce') if json_data.get('SharePoint Last Activity Date') else None,
            'has_skype_for_business_license': json_data.get('Has Skype For Business License', 'False') == 'True',
            'sharepoint_license_assign_date': pd.to_datetime(json_data.get('SharePoint License Assign Date'), errors='coerce') if json_data.get('SharePoint License Assign Date') else None,
            'skype_for_business_last_activity_date': pd.to_datetime(json_data.get('Skype For Business Last Activity Date'), errors='coerce') if json_data.get('Skype For Business Last Activity Date') else None,
            'skype_for_business_license_assign_date': pd.to_datetime(json_data.get('Skype For Business License Assign Date'), errors='coerce') if json_data.get('Skype For Business License Assign Date') else None
        }
    except json.JSONDecodeError as e:
        logging.error(f"JSON decode error for id {row['id']}: {e}")
        return None

# Uygun şekilde ayrıştırma
df_structured = df_raw.apply(parse_json, axis=1)
df_structured = pd.DataFrame(df_structured.tolist())

# Eksik verileri kontrol etme
df_structured.dropna(subset=['user_principal_name'], inplace=True)

# Yapılandırılmış veriyi `structured_data` tablosuna ekleme
for index, row in df_structured.iterrows():
    try:
        cursor.execute("""
            INSERT INTO structured_data (
                fetched_at, is_deleted, deleted_date, display_name, assigned_products,
                has_teams_license, has_yammer_license, report_refresh_date, user_principal_name,
                has_exchange_license, has_onedrive_license, has_sharepoint_license,
                teams_last_activity_date, teams_license_assign_date, yammer_last_activity_date,
                yammer_license_assign_date, exchange_last_activity_date, onedrive_last_activity_date,
                exchange_license_assign_date, onedrive_license_assign_date, sharepoint_last_activity_date,
                has_skype_for_business_license, sharepoint_license_assign_date,
                skype_for_business_last_activity_date, skype_for_business_license_assign_date
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s,
                %s, %s
            )
        """, (
            row['fetched_at'],
            row['is_deleted'],
            row['deleted_date'],
            row['display_name'],
            row['assigned_products'],
            row['has_teams_license'],
            row['has_yammer_license'],
            row['report_refresh_date'],
            row['user_principal_name'],
            row['has_exchange_license'],
            row['has_onedrive_license'],
            row['has_sharepoint_license'],
            row['teams_last_activity_date'],
            row['teams_license_assign_date'],
            row['yammer_last_activity_date'],
            row['yammer_license_assign_date'],
            row['exchange_last_activity_date'],
            row['onedrive_last_activity_date'],
            row['exchange_license_assign_date'],
            row['onedrive_license_assign_date'],
            row['sharepoint_last_activity_date'],
            row['has_skype_for_business_license'],
            row['sharepoint_license_assign_date'],
            row['skype_for_business_last_activity_date'],
            row['skype_for_business_license_assign_date']
        ))
    except Exception as e:
        logging.error(f"Veri eklenirken hata oluştu: {e}")

# Değişiklikleri kaydetme ve bağlantıyı kapatma
try:
    conn.commit()
    logging.info("Tüm veriler başarıyla structured_data tablosuna eklendi.")
except Exception as e:
    logging.error(f"Veritabanına kaydetme sırasında hata oluştu: {e}")
finally:
    cursor.close()
    conn.close()
    logging.info("PostgreSQL bağlantısı kapatıldı.")
