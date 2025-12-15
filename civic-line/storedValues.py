from getpass import getpass

def prompt_value(name: str) -> str:
    """Prompt the user for a value, input hidden for security."""
    prompt = f"Enter {name}: "
    return getpass(prompt)


def create_secrets() -> dict:
    """Prompt for all secrets and return as a dictionary."""
    secrets = {}
    secrets["open_ai_key"] = prompt_value("OPENAI_API_KEY")
    secrets["gmail_email"] = prompt_value("GMAIL EMAIL")
    secrets["gmail_app_password"] = prompt_value("GMAIL APP PASSWORD")
    secrets["postgres_connection_string"] = prompt_value("POSTGRES CONNECTION STRING")
    return secrets


def get_secret(name: str) -> str:
    """Prompt for a single secret and return its value."""
    return prompt_value(name)
