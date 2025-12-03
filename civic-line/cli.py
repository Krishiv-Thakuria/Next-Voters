from dotenv import load_dotenv
from os import getenv
from web_scraper import scrapeCouncilMeetings, scrapeLegislation
from email import sendEmails

# -----------------------------------------------------------
# MAIN EXECUTION
# -----------------------------------------------------------
if __name__ == "__main__":
    print("Loading environmental variables...")
    load_dotenv() 

    # Load all required env variables 
    open_ai_key = getenv("OPENAI_KEY")
    gmail_email = getenv("APP_GMAIL_EMAIL")
    gmail_app_password = getenv("APP_GMAIL_PWD")
    postgres_connection_string = getenv("POSTGRES_CONNECTION_STRING")

    if not all([open_ai_key, gmail_email, gmail_app_password, postgres_connection_string]): 
        print("All env variables are not loaded. Double check.") 
        exit(1)
    
    print("Scraping meetings...")
    meetings = scrapeCouncilMeetings()

    print("Scraping legislation...")
    categories = scrapeLegislation(meetings)

    print("Sending emails...")
    sendEmails(categories)

    print("Done.")
