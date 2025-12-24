from .webScraper import scrapeCouncilMeetings, scrapeLegislation
from .emailService import sendEmails
from .storedValues import create_secrets
import time 

def cli():
    isUpdateNeeded = input("Do you need to update any secret values? (y/n): ").strip().lower() 
    
    if isUpdateNeeded == 'y':
        print("Please enter the new secret values:")
        create_secrets() 
    elif isUpdateNeeded != "n":
        print("Invalid command. Try again")
        exit()
    
    # -----------------------------------------------------------
    # MAIN EXECUTION
    # -----------------------------------------------------------
    print("Scraping meetings...")
    start_time = time.time()
    meetings = scrapeCouncilMeetings()
    
    print("Scraping legislation...")
    categories = scrapeLegislation(meetings)
    
    print("Sending emails...")
    sendEmails(categories=categories)
    
    elapsed_time = time.time() - start_time
    print(f"Done. Total time: {elapsed_time:.2f} seconds")