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

# Kullanım istatistikleri için API çağrısı
usage_url = 'https://graph.microsoft.com/v1.0/reports/getOffice365ActiveUserDetail(period=\'D30\')'

response = requests.get(usage_url, headers=headers)

if response.status_code == 200:
    # Yanıt CSV formatında gelecektir
    with open('usage_stats.csv', 'wb') as f:
        f.write(response.content)
    print('Usage statistics saved to usage_stats.csv')
else:
    print('Error fetching usage statistics')
    print(response.text)


# TERMINAL : python get_usage_stats.py
