from dotenv import load_dotenv
from web_scraper import scrapeCouncilMeetings, scrapeLegislation
from email import sendEmails

# -----------------------------------------------------------
# Load Environment Variables
# -----------------------------------------------------------
load_dotenv()

# -----------------------------------------------------------
# MAIN EXECUTION
# -----------------------------------------------------------
if __name__ == "__main__":
    print("Scraping meetings...")
    meetings = scrapeCouncilMeetings()

    print("Scraping legislation...")
    categories = scrapeLegislation(meetings)

    print("Sending emails...")
    sendEmails(categories)

    print("Done.")
