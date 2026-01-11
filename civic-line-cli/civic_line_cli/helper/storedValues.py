import json
from getpass import getpass
from pathlib import Path

SECRETS_FILE = Path("secrets.json") 

default_secrets = {
    "open_ai_key": "",
    "gmail_email": "",
    "gmail_app_password": "",
    "postgres_connection_string": ""
}

if not SECRETS_FILE.exists():
    with SECRETS_FILE.open("w") as f:
        json.dump(default_secrets, f, indent=4)
    print(f"{SECRETS_FILE} did not exist. Created file with empty values.")

def prompt_value(name: str) -> str:
    """Prompt the user for a value, input hidden for security."""
    prompt = f"Enter {name}: "
    return getpass(prompt)

def create_secrets() -> dict:
    """Prompt for all secrets, store in a file, and return as a dictionary."""
    secrets = {}
    secrets["open_ai_key"] = prompt_value("OPENAI_API_KEY")
    secrets["gmail_email"] = prompt_value("GMAIL EMAIL")
    secrets["gmail_app_password"] = prompt_value("GMAIL APP PASSWORD")
    secrets["postgres_connection_string"] = prompt_value("POSTGRES CONNECTION STRING")

    # Store the secrets in the JSON file
    with SECRETS_FILE.open("w") as f:
        json.dump(secrets, f, indent=4)
    
    print(f"Secrets updated and saved to {SECRETS_FILE}")
    return secrets

def get_secret(name: str) -> str:
    """Retrieve a single secret by name from the secrets file."""
    with SECRETS_FILE.open("r") as f:
        secrets = json.load(f)
    
    if name not in secrets:
        raise KeyError(f"Secret '{name}' not found in {SECRETS_FILE}.")
    
    return secrets[name]
