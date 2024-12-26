# Cloud-SaaS Analytics & Integration Hub

![Project Logo](/raynet_saas_optimization/frontend/public/logo-gray.png)

## Overview

Cloud-SaaS Analytics & Integration Hub is a comprehensive SaaS management and analytics platform designed to optimize Microsoft Teams license usage and costs. This enterprise-grade solution provides real-time insights into user activity, license utilization, and cost optimization opportunities.

## Features

### 📊 Advanced Analytics Dashboard
- Real-time user activity monitoring
- Department-wise usage analytics
- License utilization trends
- Cost analysis and optimization recommendations

### 👥 User Management
- Detailed user profiles with Microsoft integration
- Department-based organization
- Activity status tracking
- Last active time monitoring

### 💳 License Management
- Multiple license tier support:
  - Microsoft Teams Premium
  - Microsoft Teams Business
  - Microsoft Teams Standard
  - Microsoft Teams Business Basic
  - Microsoft Teams (Free)
- Cost per user tracking
- License utilization optimization
- Automated recommendations

### 📈 Performance Metrics
- Department distribution analysis
- User status distribution
- Average usage time by department
- Daily and monthly usage trends

## Technology Stack

### Frontend
- React.js
- Recharts for data visualization
- Styled Components
- Modern ES6+ JavaScript

### Backend
- FastAPI (Python)
- PostgreSQL Database
- SQLAlchemy ORM
- Pydantic for data validation

### Deployment
- Docker containerization
- Nginx web server
- Docker Compose orchestration
- Environment-based configuration

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (v14 or higher)
- Python 3.8+
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ernayvaz/raynet_saas_optimization.git
cd raynet_saas_optimization
```

2. Set up environment variables:
```bash
cp backend/password.env.example backend/password.env
# Edit the password.env file with your database credentials
```

3. Build and run with Docker Compose:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development Setup

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API Documentation

The API documentation is available at `/docs` endpoint when running the backend server. It includes:
- Detailed endpoint descriptions
- Request/Response schemas
- Authentication requirements
- Interactive API testing interface

## Project Structure

```
raynet_saas_optimization/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── public/
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   ├── crud.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
└── docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Eren Ayvaz** - *Initial work and maintenance*

## Acknowledgments

- Microsoft Teams API Documentation
- React.js Community
- FastAPI Framework
- Docker Community

## Support

For support, please email support@raynet.com or open an issue in the GitHub repository.

---

<div align="center">
  <sub>Built with ❤️ by Eren Ayvaz</sub>
</div>