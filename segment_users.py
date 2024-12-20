import psycopg2
import pandas as pd
from sklearn.cluster import KMeans
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

# Kullanım verilerini çekme
query = """
    SELECT ul.user_id, us.active_minutes, us.login_count
    FROM user_licenses ul
    JOIN usage_stats us ON ul.user_id = us.user_id AND ul.license_id = us.license_id
    WHERE us.date = (SELECT MAX(date) FROM usage_stats)
"""
cursor.execute(query)
data = cursor.fetchall()

# DataFrame oluşturma
df = pd.DataFrame(data, columns=['user_id', 'active_minutes', 'login_count'])

# Eksik değerleri doldurma (Gerekirse)
df['active_minutes'] = df['active_minutes'].fillna(0)
df['login_count'] = df['login_count'].fillna(0)

# Özellikleri ölçeklendirme (İsteğe bağlı ama önerilir)
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df[['active_minutes_scaled', 'login_count_scaled']] = scaler.fit_transform(df[['active_minutes', 'login_count']])

# K-Means Kümeleme
# Küme sayısını ihtiyacınıza göre ayarlayabilirsiniz. Örneğin, 3 küme:
kmeans = KMeans(n_clusters=1, random_state=5)
df['cluster'] = kmeans.fit_predict(df[['active_minutes_scaled', 'login_count_scaled']])

# Sonuçları veritabanına kaydetme
for index, row in df.iterrows():
    user_id = row['user_id']
    cluster = int(row['cluster'])  # K-Means çıktısı numpy integer olabilir
    
    cursor.execute("""
        UPDATE user_licenses
        SET cluster = %s
        WHERE user_id = %s
    """, (cluster, user_id))

conn.commit()
print('User segmentation completed and results saved to the database.')

cursor.close()
conn.close()

# SQL code for Cluster
# cursor.execute("ALTER TABLE user_licenses ADD COLUMN IF NOT EXISTS cluster INTEGER;")

# user_licenses tablosunda user_id üzerinde indeks oluşturmak, UPDATE sorgularının performansını artırır.
# CREATE INDEX IF NOT EXISTS idx_user_licenses_user_id ON user_licenses(user_id);
