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

# Lisans bilgileri için API çağrısı
licenses_url = 'https://graph.microsoft.com/v1.0/subscribedSkus'

response = requests.get(licenses_url, headers=headers)

if response.status_code == 200:
    licenses = response.json().get('value', [])
    for license in licenses:
        print(f"Sku Part Number: {license.get('skuPartNumber')}, Consumed Units: {license.get('consumedUnits')}")
else:
    print('Error fetching licenses')
    print(response.text)


# TERMINAL : python get_licenses.py
