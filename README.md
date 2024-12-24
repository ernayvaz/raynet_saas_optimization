# Raynet SaaS Optimization

This project is a SaaS management tool that can be integrated with the Raynet platform, analyzing Microsoft 365 data and providing license optimization recommendations.

## Features

- **Data Integration:** Fetch user, license, and usage data through Microsoft 365 API.
- **Database Management:** Store data using PostgreSQL.
- **Analytics:** Detect unused licenses and generate cost optimization recommendations.
- **Web Dashboard:** Visually present data using React.

## Installation

### Requirements

- Python 3.11
- Node.js and npm
- Git
- PostgreSQL
- Docker (Optional)

### Steps

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/raynet_saas_optimization.git
    cd raynet_saas_optimization
    ```

2. **Backend Setup:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # For Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

4. **Run Using Docker:**
    ```bash
    cd ..
    docker-compose up --build
    ```

## Usage

- **Backend:** You can view the API documentation at `http://localhost:8000/docs`
- **Frontend:** You can view the dashboard at `http://localhost:3000`

## Contributing

If you would like to contribute, please create a pull request or open an issue directly.

## License

[MIT](LICENSE)
