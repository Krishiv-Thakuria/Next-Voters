from web_scraper import scrapeCouncilMeetings, scrapeLegislation
from emailService import sendEmails
from storedValues import create_secrets

# -----------------------------------------------------------
# LOAD SECRETS (IN-MEMORY ONLY)
# -----------------------------------------------------------

isUpdateNeeded = bool(input("Do you need to update any secret values? (y/n): ").strip().lower() == 'y')

if (isUpdateNeeded):
    print("Please enter the new secret values:")
    config = create_secrets()  # prompts user for all secrets

gmail_email = config["gmail_email"]
gmail_app_password = config["gmail_app_password"]
postgres_connection_string = config["postgres_connection_string"]

# -----------------------------------------------------------
# MAIN EXECUTION
# -----------------------------------------------------------

print("Scraping meetings...")
meetings = scrapeCouncilMeetings(connection_string=postgres_connection_string)

print("Scraping legislation...")
categories = scrapeLegislation(meetings)

print("Sending emails...")
sendEmails(categories=categories)

print("Done.")
