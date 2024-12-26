# Raynet Cloud-SaaS Analitik ve Entegrasyon Platformu

![Proje Logosu](/raynet_saas_optimization/frontend/public/logo-gray.png)

## Genel Bakış

Raynet Cloud-SaaS Analitik ve Entegrasyon Platformu, Microsoft Teams lisans kullanımını optimize etmek ve maliyetleri düşürmek için geliştirilmiş kapsamlı bir yönetim ve analiz çözümüdür. Platform, kullanıcı aktivitelerini gerçek zamanlı izleme, lisans kullanım analizi ve maliyet optimizasyonu önerileri sunmaktadır.

## 🚀 Özellikler

### 📊 Gelişmiş Analitik Paneli
- Gerçek zamanlı kullanıcı aktivite takibi
- Departman bazlı kullanım analizleri
- Lisans kullanım trendleri ve tahminleri
- Maliyet analizi ve optimizasyon tavsiyeleri
- Özelleştirilebilir raporlama araçları

### 👥 Kullanıcı Yönetimi
- Microsoft entegrasyonlu detaylı kullanıcı profilleri
- Departman bazlı organizasyon yapısı
- Aktivite durumu izleme
- Son aktivite zamanı takibi
- Kullanıcı davranış analizi

### 💳 Lisans Yönetimi
- Çoklu lisans seviyesi desteği:
  - Microsoft Teams Premium (Aylık $18/kullanıcı)
  - Microsoft Teams Business (Aylık $12.50/kullanıcı)
  - Microsoft Teams Standard (Aylık $10/kullanıcı)
  - Microsoft Teams Business Basic (Aylık $6/kullanıcı)
  - Microsoft Teams (Ücretsiz)
- Kullanıcı başına maliyet takibi
- Lisans kullanım optimizasyonu
- Otomatik tavsiye sistemi
- Maliyet tasarruf raporları

### 📈 Performans Metrikleri
- Departman dağılım analizi
- Kullanıcı durum dağılımı
- Departman bazlı ortalama kullanım süreleri
- Günlük ve aylık kullanım trendleri
- Özelleştirilebilir metrik göstergeleri

## 🛠️ Teknoloji Altyapısı

### Frontend
- React.js (Modern web arayüzü)
- Recharts (Veri görselleştirme)
- Styled Components (Stil yönetimi)
- Modern ES6+ JavaScript
- Responsive tasarım

### Backend
- FastAPI (Yüksek performanslı Python framework)
- PostgreSQL (Güvenilir veritabanı)
- SQLAlchemy ORM (Veritabanı yönetimi)
- Pydantic (Veri doğrulama)
- JWT Authentication (Güvenli erişim)

### Deployment
- Docker konteynerizasyon
- Nginx web sunucusu
- Docker Compose orkestrasyon
- Çevreye özel yapılandırma
- SSL/TLS desteği

## 🚀 Başlangıç

### Sistem Gereksinimleri
- Docker ve Docker Compose
- Node.js (v14 veya üzeri)
- Python 3.8+
- PostgreSQL 13+
- 4GB RAM (minimum)
- 10GB disk alanı

### Otomatik Kurulum
1. `start_dashboard.bat` dosyasını çalıştırın
2. Tarayıcıda otomatik olarak dashboard açılacaktır
3. Varsayılan giriş bilgileri:
   - Kullanıcı: admin@raynet.com
   - Şifre: admin123

### Manuel Kurulum

#### Backend Kurulumu
```bash
cd raynet_saas_optimization/backend
python -m venv venv
venv\Scripts\activate  # Windows için
source venv/bin/activate  # Linux/Mac için
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Kurulumu
```bash
cd raynet_saas_optimization/frontend
npm install
npm start
```

### Docker ile Kurulum
```bash
docker-compose up --build
```

## ⚙️ Yapılandırma

### Veritabanı Yapılandırması
`backend/password.env` dosyasında aşağıdaki ayarları yapın:
```env
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raynet_db
JWT_SECRET=your_secret_key
```

### Uygulama Portları
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Dokümantasyonu: http://localhost:8000/docs
- PostgreSQL: 5432

## 🔧 Sorun Giderme

### Port Çakışmaları
1. Port kullanım kontrolü:
```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :8000
lsof -i :3000
```

2. Çalışan process'i sonlandırma:
```bash
# Windows
taskkill /PID <pid_number> /F

# Linux/Mac
kill -9 <pid_number>
```

### Veritabanı Sorunları
1. PostgreSQL servis kontrolü:
```bash
# Windows
net start postgresql

# Linux
sudo service postgresql status
```

2. Veritabanı bağlantı testi:
```bash
psql -h localhost -U postgres -d raynet_db
```

### Yaygın Hatalar ve Çözümleri
1. "Module not found" hatası:
   - `pip install -r requirements.txt` komutunu tekrar çalıştırın
   - Virtual environment'ın aktif olduğundan emin olun

2. "npm ERR!" hataları:
   - `node_modules` klasörünü silin
   - `npm cache clean --force` komutunu çalıştırın
   - `npm install` ile tekrar deneyin

3. Docker hataları:
   - Docker servisinin çalıştığından emin olun
   - `docker-compose down -v` ile tüm container'ları temizleyin
   - `docker-compose up --build` ile yeniden başlatın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

## 👥 Katkıda Bulunanlar

- **Eren Ayvaz** - *Geliştirici ve Proje Yöneticisi*

## 📞 Destek

Teknik destek ve sorularınız için:
- E-posta: support@raynet.com
- GitHub Issues: [Yeni Issue Oluştur](https://github.com/ernayvaz/raynet_saas_optimization/issues)
- Dokümantasyon: [Wiki Sayfası](https://github.com/ernayvaz/raynet_saas_optimization/wiki)

---

<div align="center">
  <sub>❤️ ile Raynet tarafından geliştirilmiştir</sub>
</div> 