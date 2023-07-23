from google.cloud import storage
from google.oauth2.service_account import Credentials

def authenticate_with_service_account():
    credentials_info = {
        "type": "service_account",
        "project_id": "animated-axe-387204",
        "private_key_id": "YOUR_PRIVATE_KEY_ID",
        "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
        "client_email": "your-service-account@animated-axe-387204.iam.gserviceaccount.com",
        "client_id": "YOUR_CLIENT_ID",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40animated-axe-387204.iam.gserviceaccount.com"
    }

    credentials = Credentials.from_service_account_info(credentials_info)
    project_id = "animated-axe-387204"  # Replace this with your Google Cloud project ID
    storage_client = storage.Client(project=project_id, credentials=credentials)
    buckets = storage_client.list_buckets()
    print("Buckets:")
    for bucket in buckets:
        print(bucket.name)
    print("Listed all storage buckets.")

    
authenticate_with_service_account()
