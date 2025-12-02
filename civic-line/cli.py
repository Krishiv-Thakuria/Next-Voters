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
    
    
    print("Scraping meetings...")
    meetings = scrapeCouncilMeetings()

    print("Scraping legislation...")
    categories = scrapeLegislation(meetings)

    print("Sending emails...")
    sendEmails(categories)

    print("Done.")
