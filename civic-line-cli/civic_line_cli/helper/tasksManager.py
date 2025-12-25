from ..globalStates import meetings, fileLocaters, bills
from .aiUtils import runAIOnBill

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
    