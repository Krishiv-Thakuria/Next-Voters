import time 
import asyncio

from .helper.scraper import scrapeCouncilMeetings, scrapeMeetingDetails, scrapeLegislationDetail
from .helper.emailService import sendEmails
from .helper.storedValues import create_secrets
from .helper.webRequester import fetchCouncilMeetings, fetchMeetingDetails, fetchLegislationDetails
from .helper.aiProcessor import processBillsWithAI

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
    
    print("Fetching meeting details (legislation list)...")
    await fetchMeetingDetails()
    
    print("Scraping meeting details (legislation list)...")
    scrapeMeetingDetails()

    print("Fetching legislation details...")
    await fetchLegislationDetails()

    print("Scraping legislation details...")
    scrapeLegislationDetail()
    
    print("Processing bills with AI...")
    await processBillsWithAI() 
    
    print("Sending emails...")
    sendEmails()
    
    elapsed_time = time.time() - start_time
    print(f"Total time: {elapsed_time:.2f} seconds")

def main():
    asyncio.run(cli())
