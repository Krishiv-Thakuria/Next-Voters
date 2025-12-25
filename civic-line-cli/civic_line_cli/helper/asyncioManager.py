import asyncio
from aiohttp import ClientSession
from ..globalStates import meetings, meetingDetailsHTML, legislationDetailsHTML, bills, categories, fileLocaters
from .ai import runAIOnBill


async def fetchCouncilMeetings():
    async with ClientSession() as session:
        async with session.get("https://legistar.council.nyc.gov/Calendar.aspx?Mode=Last+Month") as response:
            html = await response.text()
    return html


def getMeetingDetailsTasks(session):
    tasks = []
    for meeting in meetings:
        tasks.append(session.get(f"https://legistar.council.nyc.gov/{meeting['meetingDetails']}", ssl=False))
    return tasks

def getLegislationDetailsTask(session):
    tasks = []
    for fileLocator in fileLocaters:
        tasks.append(session.get(f"https://legistar.council.nyc.gov/{fileLocator}", ssl=False))
    return tasks

def getAITasks():
    tasks = []
    for bill in bills:
        tasks.append(runAIOnBill(bill))
    return tasks


async def fetchMeetingDetails(): 
    async with ClientSession() as session:
        tasks = getMeetingDetailsTasks(session)
        responses = await asyncio.gather(*tasks)
        for response in responses:
            html = await response.text()
            meetingDetailsHTML.append(html)

async def fetchLegislationDetails():
    async with ClientSession() as session:
        tasks = getLegislationDetailsTask(session)
        responses = await asyncio.gather(*tasks)
        for response in responses:
            html = await response.text()
            legislationDetailsHTML.append(html)

async def processBillsWithAI():
    tasks = getAITasks()
    responses = await asyncio.gather(*tasks)
    
    for response in responses:
        category, name, fileNumber, summary, sponsors = response
        billData = {
            "name": name,
            "fileNumber": fileNumber,
            "summarized": summary,
            "sponsors": sponsors
        }
        if category in categories:
            categories[category].append(billData)
        else:
            print("Unknown category:", category)

    