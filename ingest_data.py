import requests
import psycopg2 
import json
from datetime import datetime
from dotenv import load_dotenv
import os

# .env dosyasını yükle
load_dotenv()

# PostgreSQL bağlantı bilgileri
conn = psycopg2.connect(
    host="localhost",
    dbname="raynet_db",
    user="postgres",
    password=os.getenv("POSTGRES_PASSWORD")
)
cursor = conn.cursor()

# Access Token'ınızı buraya yapıştırın
access_token =  os.getenv("ACCESS_TOKEN")

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

# Kullanım istatistikleri için API çağrısı
usage_url = 'https://graph.microsoft.com/v1.0/reports/getOffice365ActiveUserDetail(period=\'D30\')'

response = requests.get(usage_url, headers=headers)

if response.status_code == 200:
    # Yanıt CSV formatında gelecektir
    csv_data = response.text

    # CSV verisini JSON formatına dönüştürme (basit bir örnek)
    import csv
    from io import StringIO

    f = StringIO(csv_data)
    reader = csv.DictReader(f)
    records = list(reader)

    # Her bir kaydı raw_data tablosuna ekleyin
    for record in records:
        fetched_at = datetime.strptime(record['Report Refresh Date'], '%Y-%m-%d')
        raw_json = json.dumps(record)
        cursor.execute(
            "INSERT INTO raw_data (fetched_at, raw_json) VALUES (%s, %s)",
            (fetched_at, raw_json)
        )

    conn.commit()
    print('Raw data successfully ingested.')
else:
    print('Error fetching usage statistics:')
    print(response.text)

cursor.close()
conn.close()
