import asyncio
from ..globalStates import categories
from .tasksManager import getAITasks


async def processBillsWithAI():
    """Execute AI processing tasks and organize results by category"""
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