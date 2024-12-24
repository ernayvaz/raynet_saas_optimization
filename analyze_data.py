import psycopg2
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

# PostgreSQL connection details
conn = psycopg2.connect(
    host="localhost",
    dbname="raynet_db",
    user="postgres",
    password=os.getenv("POSTGRES_PASSWORD")  # Used as environment variable
)
cursor = conn.cursor()

# Current date
current_date = datetime.now().date()

# Find users inactive for more than 30 days
threshold_date = current_date - timedelta(days=30)

# Threshold values
ACTIVE_MINUTES_THRESHOLD = 100
LOGIN_COUNT_THRESHOLD = 3

cursor.execute("""
    SELECT u.user_id, u.email, ul.license_id, l.license_name
    FROM users u
    JOIN user_licenses ul ON u.user_id = ul.user_id
    JOIN licenses l ON ul.license_id = l.license_id
    WHERE ul.last_active_at < %s OR ul.last_active_at IS NULL
""", (threshold_date,))

inactive_users = cursor.fetchall()

for user in inactive_users:
    user_id, email, license_id, license_name = user
    print(f"User: {email}, License: {license_name}, Last Active: {license_id}")

    # Check if optimization recommendation already exists
    cursor.execute("""
        SELECT COUNT(*) FROM optimizations
        WHERE user_id = %s AND license_id = %s
    """, (user_id, license_id))
    count = cursor.fetchone()[0]

    if count == 0:
        # Create cost optimization recommendation
        recommendation_text = f"User {email} has not been active for over 30 days. Consider downgrading their {license_name} license to reduce costs."

        cursor.execute("""
            INSERT INTO optimizations (user_id, license_id, recommendation_text)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (user_id, license_id, recommendation_text))
    else:
        print(f"Optimization already exists for User: {email}, License: {license_name}")

# Optimization recommendations for users with low usage rates
cursor.execute("""
    SELECT u.user_id, u.email, ul.license_id, l.license_name
    FROM users u
    JOIN user_licenses ul ON u.user_id = ul.user_id
    JOIN licenses l ON ul.license_id = l.license_id
    JOIN usage_stats us ON u.user_id = us.user_id AND ul.license_id = us.license_id
    WHERE us.active_minutes < %s OR us.login_count < %s
    GROUP BY u.user_id, u.email, ul.license_id, l.license_name
""", (ACTIVE_MINUTES_THRESHOLD, LOGIN_COUNT_THRESHOLD))

low_usage_users = cursor.fetchall()

for user in low_usage_users:
    user_id, email, license_id, license_name = user
    print(f"Low Usage User: {email}, License: {license_name}")

    # Check if optimization recommendation already exists
    cursor.execute("""
        SELECT COUNT(*) FROM optimizations
        WHERE user_id = %s AND license_id = %s
    """, (user_id, license_id))
    count = cursor.fetchone()[0]

    if count == 0:
        # Create cost optimization recommendation
        recommendation_text = f"User {email} has low usage of their {license_name} license. Consider downgrading or reallocating their license to optimize costs."

        cursor.execute("""
            INSERT INTO optimizations (user_id, license_id, recommendation_text)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (user_id, license_id, recommendation_text))
    else:
        print(f"Optimization already exists for User: {email}, License: {license_name}")

conn.commit()
print('Analytics completed and optimization suggestions generated.')

cursor.close()
conn.close()