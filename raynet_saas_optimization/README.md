# Raynet Cloud-SaaS Analytics & Integration Platform

![Project Logo](/raynet_saas_optimization/frontend/public/logo-gray.png)

## Overview

Raynet Cloud-SaaS Analytics & Integration Platform is a comprehensive management and analytics solution designed to optimize Microsoft Teams license usage and reduce costs. The platform offers real-time user activity monitoring, license usage analysis, and cost optimization recommendations.

## 🚀 Features

### 📊 Advanced Analytics Dashboard
- Real-time user activity tracking
- Department-based usage analytics
- License utilization trends and forecasting
- Cost analysis and optimization recommendations
- Customizable reporting tools

### 👥 User Management
- Detailed user profiles with Microsoft integration
- Department-based organizational structure
- Activity status monitoring
- Last active time tracking
- User behavior analysis

### 💳 License Management
- Multi-tier license support:
  - Microsoft Teams Premium ($18/user/month)
  - Microsoft Teams Business ($12.50/user/month)
  - Microsoft Teams Standard ($10/user/month)
  - Microsoft Teams Business Basic ($6/user/month)
  - Microsoft Teams (Free)
- Cost per user tracking
- License utilization optimization
- Automated recommendation system
- Cost savings reports

### 📈 Performance Metrics
- Department distribution analysis
- User status distribution
- Average usage time by department
- Daily and monthly usage trends
- Customizable metric indicators

## 🛠️ Technology Stack

### Frontend
- React.js (Modern web interface)
- Recharts (Data visualization)
- Styled Components (Style management)
- Modern ES6+ JavaScript
- Responsive design

### Backend
- FastAPI (High-performance Python framework)
- PostgreSQL (Reliable database)
- SQLAlchemy ORM (Database management)
- Pydantic (Data validation)
- JWT Authentication (Secure access)

### Deployment
- Docker containerization
- Nginx web server
- Docker Compose orchestration
- Environment-specific configuration
- SSL/TLS support

## 🚀 Getting Started

### System Requirements
- Docker and Docker Compose
- Node.js (v14 or higher)
- Python 3.8+
- PostgreSQL 13+
- 4GB RAM (minimum)
- 10GB disk space

### Automatic Installation
1. Run the `start_dashboard.bat` file
2. Dashboard will automatically open in your browser
3. Default login credentials:
   - Username: admin@raynet.com
   - Password: admin123

### Manual Installation

#### Backend Setup
```bash
cd raynet_saas_optimization/backend
python -m venv venv
venv\Scripts\activate  # For Windows
source venv/bin/activate  # For Linux/Mac
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd raynet_saas_optimization/frontend
npm install
npm start
```

### Docker Installation
```bash
docker-compose up --build
```

## ⚙️ Configuration

### Database Configuration
Configure the following settings in `backend/password.env`:
```env
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raynet_db
JWT_SECRET=your_secret_key
```

### Application Ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- PostgreSQL: 5432

## 🔧 Troubleshooting

### Port Conflicts
1. Check port usage:
```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :8000
lsof -i :3000
```

2. Terminate running process:
```bash
# Windows
taskkill /PID <pid_number> /F

# Linux/Mac
kill -9 <pid_number>
```

### Database Issues
1. PostgreSQL service check:
```bash
# Windows
net start postgresql

# Linux
sudo service postgresql status
```

2. Database connection test:
```bash
psql -h localhost -U postgres -d raynet_db
```

### Common Errors and Solutions
1. "Module not found" error:
   - Run `pip install -r requirements.txt` again
   - Ensure virtual environment is activated

2. "npm ERR!" errors:
   - Delete `node_modules` directory
   - Run `npm cache clean --force`
   - Try again with `npm install`

3. Docker errors:
   - Ensure Docker service is running
   - Clean all containers with `docker-compose down -v`
   - Restart with `docker-compose up --build`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **Eren Ayvaz** - *Developer and Project Manager*

## 📞 Support

For technical support and inquiries:
- Email: support@raynet.com
- GitHub Issues: [Create New Issue](https://github.com/ernayvaz/raynet_saas_optimization/issues)
- Documentation: [Wiki Page](https://github.com/ernayvaz/raynet_saas_optimization/wiki)

---

<div align="center">
  <sub>Built with ❤️ by Raynet</sub>
</div>