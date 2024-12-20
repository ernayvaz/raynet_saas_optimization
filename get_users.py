import requests
from dotenv import load_dotenv
import os

# .env dosyasını yükle
load_dotenv()

# Access Token'ınızı buraya yapıştırın
access_token =  os.getenv("ACCESS_TOKEN")

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

# Kullanıcı listesi için API çağrısı
users_url = 'https://graph.microsoft.com/v1.0/users'

response = requests.get(users_url, headers=headers)

if response.status_code == 200:
    users = response.json().get('value', [])
    for user in users:
        print(f"Name: {user.get('displayName')}, Email: {user.get('mail')}")
else:
    print('Error fetching users')
    print(response.text)


# TERMINAL : python get_licenses.py
