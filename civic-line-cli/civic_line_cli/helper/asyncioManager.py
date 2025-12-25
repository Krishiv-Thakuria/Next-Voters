import asyncio
from aiohttp import ClientSession
from ..globalStates import meetings, resultsHTML, bills, categories
from .ai import runAIOnBill


async def fetchCouncilMeetings():
    async with ClientSession() as session:
        async with session.get("https://legistar.council.nyc.gov/Calendar.aspx?Mode=Last+Month") as response:
            html = await response.text()
    return html


def getLegislationWebRequestTasks(session):
    tasks = []
    for meeting in meetings:
        # ssl=False goes INSIDE session.get(), not after append()
        tasks.append(session.get(f"https://legistar.council.nyc.gov/{meeting['meetingDetails']}", ssl=False))
    return tasks


def getAITasks():
    tasks = []
    for bill in bills:
        tasks.append(runAIOnBill(bill["fullText"]))
    return tasks


async def fetchLegislation(): 
    async with ClientSession() as session:
        tasks = getLegislationWebRequestTasks(session)
        responses = await asyncio.gather(*tasks)
        for response in responses:
            html = await response.text()
            resultsHTML.append(html)


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