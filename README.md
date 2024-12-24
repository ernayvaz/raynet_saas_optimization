# Raynet SaaS Optimization Dashboard

Bu dashboard, SaaS lisans optimizasyonunu görselleştirmek ve yönetmek için tasarlanmış bir araçtır.

## Gereksinimler

Uygulamayı çalıştırmak için aşağıdaki yazılımların yüklü olması gerekmektedir:

1. Python 3.8 veya üzeri
2. Node.js 14 veya üzeri
3. PostgreSQL 13 veya üzeri

## Hızlı Başlangıç

1. PostgreSQL servisinin çalıştığından emin olun
2. `start_dashboard.bat` dosyasına çift tıklayın
3. Tarayıcınızda otomatik olarak dashboard açılacaktır
4. İşiniz bittiğinde, açılan komut penceresinde herhangi bir tuşa basarak tüm servisleri kapatabilirsiniz

## Manuel Kurulum

Eğer otomatik başlatma script'i çalışmazsa, aşağıdaki adımları takip edebilirsiniz:

### Backend Kurulumu

```bash
cd raynet_saas_optimization/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend Kurulumu

```bash
cd raynet_saas_optimization/frontend
npm install
npm start
```

## Veritabanı Yapılandırması

PostgreSQL veritabanı bağlantı bilgilerinizi `.env` dosyasında güncelleyin:

```env
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raynet_db
```

## Sorun Giderme

1. "Port already in use" hatası alırsanız:
   - Backend için: `netstat -ano | findstr :8000`
   - Frontend için: `netstat -ano | findstr :3000`
   - Bulunan PID'yi kullanarak: `taskkill /PID <pid_number> /F`

2. PostgreSQL bağlantı hatası alırsanız:
   - PostgreSQL servisinin çalıştığından emin olun
   - Veritabanı bağlantı bilgilerinin doğru olduğunu kontrol edin

3. Paket yükleme hataları için:
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install`

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
