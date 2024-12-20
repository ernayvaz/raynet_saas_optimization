import sys
import logging
import psycopg2
import pandas as pd
import json
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import StandardScaler

# Loglama yapılandırması
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Log formatını belirleme
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# FileHandler oluşturma ve UTF-8 kodlamasını ayarlama
file_handler = logging.FileHandler('predict_trends_xgboost.log', encoding='utf-8')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# StreamHandler oluşturma ve özel emit fonksiyonu ile UTF-8 kodlamasını ayarlama
stream_handler = logging.StreamHandler(sys.stdout)
stream_handler.setFormatter(formatter)

# StreamHandler için emit fonksiyonunu override ederek encoding hatalarını atlama
def safe_emit(record):
    try:
        msg = formatter.format(record)
        stream_handler.stream.write(msg + '\n')
        stream_handler.flush()
    except UnicodeEncodeError:
        # Hata oluşursa, sorunlu karakterleri atlayarak log yaz
        msg = formatter.format(record)
        msg = msg.encode('utf-8', 'replace').decode('utf-8')
        stream_handler.stream.write(msg + '\n')
        stream_handler.flush()

stream_handler.emit = safe_emit

logger.addHandler(stream_handler)

# .env dosyasını yükle
load_dotenv()

# PostgreSQL bağlantı bilgileri
try:
    conn = psycopg2.connect(
        host="localhost",
        dbname="raynet_db",
        user="postgres",
        password=os.getenv("POSTGRES_PASSWORD")  # Çevresel değişkenden şifre al
    )
    cursor = conn.cursor()
    logging.info("PostgreSQL bağlantısı başarılı.")
except Exception as e:
    logging.error(f"PostgreSQL bağlantısı kurulamadı: {e}")
    exit(1)

# Tahmin edilecek gün sayısı
FORECAST_DAYS = 30

# Kullanıcı ve lisans kombinasyonlarını çekme
query = """
    SELECT ul.user_id, ul.license_id, us.date, us.active_minutes, us.login_count
    FROM user_licenses ul
    JOIN usage_stats us ON ul.user_id = us.user_id AND ul.license_id = us.license_id
    ORDER BY ul.user_id, ul.license_id, us.date
"""
try:
    cursor.execute(query)
    data = cursor.fetchall()
    logging.info("Kullanım verileri başarıyla çekildi.")
except Exception as e:
    logging.error(f"Kullanım verileri çekilirken hata oluştu: {e}")
    cursor.close()
    conn.close()
    exit(1)

# Veriyi DataFrame'e dönüştürme
df = pd.DataFrame(data, columns=['user_id', 'license_id', 'date', 'active_minutes', 'login_count'])

# Tarih sütununun doğru formatta olduğundan emin olun
df['date'] = pd.to_datetime(df['date'], errors='coerce')

# Geçersiz tarih formatı bulunan kayıtları kontrol edin
if df['date'].isnull().any():
    num_invalid = df['date'].isnull().sum()
    logging.warning(f"{num_invalid} kayıtta geçersiz tarih formatı bulundu. Bu kayıtlar atlanacak.")
    df = df.dropna(subset=['date'])

# Tekrarlayan kayıtları birleştirme (aynı user_id, license_id ve date için active_minutes ve login_count'u toplama)
df = df.groupby(['user_id', 'license_id', 'date'], as_index=False).agg({
    'active_minutes': 'sum',
    'login_count': 'sum'
})

# Kullanıcı ve lisans bazında tahmin yapma
user_license_groups = df.groupby(['user_id', 'license_id'])

for (user_id, license_id), group in user_license_groups:
    # Zaman serisi verisini hazırlama
    usage_df = group[['date', 'active_minutes']].rename(columns={'date': 'ds', 'active_minutes': 'y'})
    
    # Veri yeterliliği kontrolü
    if len(usage_df) < 30:
        logging.info(f"Yeterli veri yok: Kullanıcı ID: {user_id}, Lisans: {license_id}. Tahmin atlanıyor.")
        continue
    
    # Eksik tarihler olup olmadığını kontrol edin ve doldurun
    usage_df = usage_df.set_index('ds').asfreq('D', fill_value=0).reset_index()
    
    # Özellik mühendisliği: Lag özellikleri oluşturma
    for lag in range(1, 8):  # 1'den 7'ye kadar gecikmeli günler
        usage_df[f'lag_{lag}'] = usage_df['y'].shift(lag)
    
    # Hareketli ortalamalar
    usage_df['rolling_mean_3'] = usage_df['y'].rolling(window=3).mean().shift(1)
    usage_df['rolling_mean_7'] = usage_df['y'].rolling(window=7).mean().shift(1)
    
    # Günün haftası ve ayı gibi kategorik özellikler
    usage_df['day_of_week'] = usage_df['ds'].dt.dayofweek
    usage_df['month'] = usage_df['ds'].dt.month
    
    # Son 7 günün toplam aktif dakikası
    usage_df['sum_last_7'] = usage_df['y'].shift(1).rolling(window=7).sum()
    
    # Eksik değerleri doldurma
    usage_df.fillna(0, inplace=True)
    
    # Feature ve target değişkenlerini belirleme
    feature_cols = [f'lag_{lag}' for lag in range(1, 8)] + ['rolling_mean_3', 'rolling_mean_7', 'day_of_week', 'month', 'sum_last_7']
    X = usage_df[feature_cols]
    y = usage_df['y']
    
    # Eğitim ve test seti oluşturma (tüm veriyi kullanarak geleceği tahmin edeceğimiz için burada sadece eğitim yapacağız)
    # Ancak, modelin doğruluğunu kontrol etmek için bir test seti oluşturabilirsiniz.
    
    # Veri kümesini eğitim ve doğrulama olarak bölme
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Veriyi ölçeklendirme
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    
    # XGBoost modeli oluşturma ve eğitme
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    
    try:
        model.fit(X_train_scaled, y_train)
        logging.info(f"XGBoost modeli eğitildi: Kullanıcı ID: {user_id}, Lisans: {license_id}")
        
        # Model performansını değerlendirme
        y_pred = model.predict(X_val_scaled)
        mae = mean_absolute_error(y_val, y_pred)
        logging.info(f"Model MAE: {mae:.2f} - Kullanıcı ID: {user_id}, Lisans: {license_id}")
        
        # Gelecek 30 gün için tahmin yapma
        future_predictions = []
        last_known_date = usage_df['ds'].max()
        current_input = usage_df.copy()
        
        for day in range(1, FORECAST_DAYS + 1):
            next_date = last_known_date + timedelta(days=day)
            
            # Yeni gün için özellikleri oluşturma
            new_features = {}
            for lag in range(1, 8):
                new_features[f'lag_{lag}'] = current_input['y'].iloc[-lag] if len(current_input) >= lag else 0
            
            new_features['rolling_mean_3'] = current_input['y'].iloc[-3:].mean() if len(current_input) >= 3 else 0
            new_features['rolling_mean_7'] = current_input['y'].iloc[-7:].mean() if len(current_input) >= 7 else 0
            new_features['day_of_week'] = next_date.dayofweek
            new_features['month'] = next_date.month
            new_features['sum_last_7'] = current_input['y'].iloc[-7:].sum() if len(current_input) >= 7 else 0
            
            # Eksik değerleri doldurma
            for key in new_features:
                if pd.isna(new_features[key]):
                    new_features[key] = 0
            
            # Feature vector'ı oluşturma
            feature_vector = [new_features[col] for col in feature_cols]
            feature_vector_scaled = scaler.transform([feature_vector])
            
            # Tahmin yapma
            predicted_active_minutes = model.predict(feature_vector_scaled)[0]
            predicted_active_minutes = max(0, int(round(predicted_active_minutes)))  # Negatif tahminleri sıfırla
            
            # Tahminleri ekleme
            future_predictions.append({
                'user_id': user_id,
                'license_id': license_id,
                'predicted_date': next_date.date(),
                'predicted_active_minutes': predicted_active_minutes,
                'predicted_login_count': 0  # login_count için tahmin yapmadığımızdan 0 ekliyoruz
            })
            
            # Yeni tahmini mevcut veriye ekleme
            current_input = current_input.append({'ds': next_date, 'y': predicted_active_minutes}, ignore_index=True)
        
        # Tahminleri DataFrame'e dönüştürme
        future_df = pd.DataFrame(future_predictions)
        
        # Tahminleri veritabanına ekleme
        if not future_df.empty:
            records = future_df.to_records(index=False)
            cursor.executemany("""
                INSERT INTO usage_predictions (user_id, license_id, predicted_date, predicted_active_minutes, predicted_login_count)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (user_id, license_id, predicted_date) DO NOTHING
            """, records)
            logging.info(f"Predictions saved: Kullanıcı ID: {user_id}, Lisans: {license_id}")
    
    except Exception as e:
        logging.error(f"XGBoost modeli çalıştırılırken hata oluştu: Kullanıcı ID: {user_id}, Lisans: {license_id}. Hata: {e}")

# Değişiklikleri kaydetme ve bağlantıyı kapatma
try:
    conn.commit()
    logging.info("Tüm tahminler başarıyla veritabanına kaydedildi.")
except Exception as e:
    logging.error(f"Veritabanına kaydetme sırasında hata oluştu: {e}")
finally:
    cursor.close()
    conn.close()
    logging.info("PostgreSQL bağlantısı kapatıldı.")







# SQL CODES
'''
CREATE TABLE IF NOT EXISTS usage_predictions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    license_id VARCHAR(255) NOT NULL,
    predicted_date DATE NOT NULL,
    predicted_active_minutes INT NOT NULL,
    predicted_login_count INT NOT NULL,
    UNIQUE(user_id, license_id, predicted_date)
);
'''