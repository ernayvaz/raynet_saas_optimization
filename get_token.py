import requests
import os

# Azure Portal'dan aldığınız bilgileri buraya girin
tenant_id = '59c751df-af72-49a0-a37e-10a6c7aefd22'
client_id = 'd04b4b10-556a-460e-911a-edbd019b79f9'
client_secret = 'PjZ8Q~i8-6jTDT_lOwq7uva0vQ.nx.jdW18WmcPC'

# OAuth2 Token URL
token_url = f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'

# İstek için gerekli parametreler
payload = {
    'grant_type': 'client_credentials',
    'client_id': client_id,
    'client_secret': client_secret,
    'scope': 'https://graph.microsoft.com/.default'
}

# POST isteği ile token al
response = requests.post(token_url, data=payload)

if response.status_code == 200:
    token = response.json().get('access_token')
    print(f'Access Token: {token}')

    # .env dosyasının içeriğini oku
    env_path = r"C:\Users\erena\Desktop\Raynet Projects\SaaS_Prototype\.env"
    with open(env_path, 'r') as file:
        lines = file.readlines()

    # ACCESS_TOKEN satırını güncelle
    for i, line in enumerate(lines):
        if line.startswith('ACCESS_TOKEN='):
            lines[i] = f'ACCESS_TOKEN={token}\n'

    # Güncellenmiş içeriği dosyaya yaz
    with open(env_path, 'w') as file:
        file.writelines(lines)
else:
    print('Error obtaining access token')
    print(response.text)


# TERMINAL : python get_token.py
