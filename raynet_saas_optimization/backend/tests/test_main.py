import sys
import os
#import pytest

# 'app' klasörünün yolunu ekleyin
current_dir = os.path.dirname(os.path.abspath(r"C:\Users\erena\Desktop\Raynet Projects\SaaS_Prototype\raynet_saas_optimization\backend\app"))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_users():
    response = client.get("/api/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_user():
    new_user = {
        "user_id": "test_user_223",
        "email": "test223@example.com",
        "department": "HR",
        "status": "active"
    }
    response = client.post("/api/users/", json=new_user)
    assert response.status_code == 200
    assert response.json()["email"] == "test223@example.com"
