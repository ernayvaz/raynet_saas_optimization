# 🚀 Raynet SaaS Analytics Projects

This repository contains a collection of SaaS analytics and optimization projects developed by Raynet.

## 📂 Projects

### [Cloud-SaaS Analytics & Integration Platform](/raynet_saas_optimization)

A comprehensive management and analytics solution designed to optimize Microsoft Teams license usage and reduce costs. The platform offers real-time user activity monitoring, license usage analysis, and cost optimization recommendations.

#### Key Features
- 📊 Real-time analytics dashboard
- 👥 Advanced user management
- 💳 Multi-tier license optimization
- 📈 Performance metrics and reporting
- 🔒 Secure authentication and access control

[View Project Details →](/raynet_saas_optimization)

## 🛠️ Development Environment Setup

### System Requirements
- Windows 10/11, macOS, or Linux
- Docker Desktop 4.0+ and Docker Compose
- Node.js v14 or higher
- Python 3.8+
- PostgreSQL 13+
- Git
- 4GB RAM (minimum)
- 10GB free disk space

### Step-by-Step Installation Guide

1. **Prepare Your Environment**
   ```bash
   # Install Node.js dependencies globally
   npm install -g npm@latest
   
   # Install Python virtual environment
   pip install virtualenv
   ```

2. **Clone and Setup the Project**
   ```bash
   # Clone the repository
   git clone https://github.com/ernayvaz/raynet_saas_optimization.git
   cd raynet_saas_optimization
   
   # Create and activate Python virtual environment
   python -m venv venv
   # For Windows:
   .\venv\Scripts\activate
   # For Linux/Mac:
   source venv/bin/activate
   ```

3. **Choose Your Installation Method**

   #### A. Automatic Installation (Recommended)
   ```bash
   # Windows
   start_dashboard.bat
   
   # Linux/Mac
   ./start_dashboard.sh
   ```
   The dashboard will automatically open in your default browser.

   #### B. Manual Installation
   
   1. Setup Backend:
      ```bash
      cd backend
      pip install -r requirements.txt
      
      # Configure database
      cp password.env.example password.env
      # Edit password.env with your database credentials
      
      # Start backend server
      python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
      ```
   
   2. Setup Frontend (New Terminal):
      ```bash
      cd frontend
      npm install
      npm start
      ```

   #### C. Docker Installation
   ```bash
   # Build and start containers
   docker-compose up --build
   
   # To stop containers
   docker-compose down
   ```

4. **Verify Installation**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Default Login:
     - Username: admin@raynet.com
     - Password: admin123

## 🔧 Common Issues & Solutions

### Port Conflicts
```bash
# Check if ports are in use
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :3000
lsof -i :8000

# Free up ports if needed
# Windows (replace <PID> with actual process ID)
taskkill /F /PID <PID>

# Linux/Mac
kill -9 <PID>
```

### Database Connection Issues
1. Ensure PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql
   
   # Linux
   sudo service postgresql status
   ```

2. Test database connection:
   ```bash
   psql -h localhost -U postgres -d raynet_db
   ```

### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules
npm install
```

### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

## 📚 Documentation

- [Project Documentation](/raynet_saas_optimization)
- [API Documentation](http://localhost:8000/docs) (available after starting the server)
- [Wiki](https://github.com/ernayvaz/raynet_saas_optimization/wiki)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](/raynet_saas_optimization#contributing) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Eren Ayvaz** - *Lead Developer & Project Manager*
  - [GitHub](https://github.com/ernayvaz)
  - [LinkedIn](https://linkedin.com/in/erenayvaz)

---

<div align="center">
  <sub>Built with ❤️ by Raynet | © 2024 Raynet. All rights reserved.</sub>
</div>
