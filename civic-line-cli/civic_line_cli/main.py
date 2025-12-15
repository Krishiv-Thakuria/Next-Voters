from webScraper import scrapeCouncilMeetings, scrapeLegislation
from emailService import sendEmails
from storedValues import create_secrets

def cli():
    isUpdateNeeded = input("Do you need to update any secret values? (y/n): ").strip().lower() 

    if isUpdateNeeded == 'y':
        print("Please enter the new secret values:")
        create_secrets() 

    elif isUpdateNeeded != "n":
        print("Invalid cmnd. Try again")
        exit()

    # -----------------------------------------------------------
    # MAIN EXECUTION
    # -----------------------------------------------------------

    print("Scraping meetings...")
    meetings = scrapeCouncilMeetings()

    print("Scraping legislation...")
    categories = scrapeLegislation(meetings)

    print("Sending emails...")
    sendEmails(categories=categories)

    print("Done.")