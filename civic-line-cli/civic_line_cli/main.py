from .helper.scraper import scrapeCouncilMeetings, scrapeLegislations
from .helper.emailService import sendEmails
from .helper.storedValues import create_secrets
from .helper.asyncioManager import fetchCouncilMeetings, fetchLegislation, processBillsWithAI
import time 
import asyncio


async def cli():
    isUpdateNeeded = input("Do you need to update any secret values? (y/n): ").strip().lower() 
    
    if isUpdateNeeded == 'y':
        print("Please enter the new secret values:")
        create_secrets() 
    elif isUpdateNeeded != "n":
        print("Invalid command. Try again")
        exit()
    
    start_time = time.time()
    
    print("Fetching meetings...")
    meetingHTML = await fetchCouncilMeetings()
    
    print("Scraping meetings...")
    scrapeCouncilMeetings(meetingHTML)
    
    print("Fetching legislation...")
    await fetchLegislation()
    
    print("Scraping legislation...")
    scrapeLegislations()
    
    print("Processing bills with AI...")
    await processBillsWithAI()  # Missing await!
    
    print("Sending emails...")
    sendEmails()
    
    elapsed_time = time.time() - start_time
    print(f"Total time: {elapsed_time:.2f} seconds")


if __name__ == "__main__":
    asyncio.run(cli())  