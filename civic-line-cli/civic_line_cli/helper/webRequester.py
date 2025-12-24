import asyncio 
import requests
import time

async def fetchCouncilMeetings(id):
    await asyncio.sleep(3)
    return "Fetched Legislation Data {id}"

async def fetchLegislation(id): 
    await asyncio.sleep(3)
    return f"Fetched Legislation Data {id}"

async def runMultipleFetches():
    start_time = time.time()
    task1 = asyncio.create_task(fetchLegislation(1))
    task2 = asyncio.create_task(fetchLegislation(2))
    task3 = asyncio.create_task(fetchLegislation(3))
    result1 = await task1
    result2 = await task2
    result3 = await task3

    print(result1, result2, result3)
    elapsed_time = time.time() - start_time
    print(f"runMultipleFetches took: {elapsed_time:.2f} seconds")

async def runMultipleFetches2():
    start_time = time.time()
    await fetchCouncilMeetings(1);
    await fetchCouncilMeetings(2);
    await fetchCouncilMeetings(3);
    elapsed_time = time.time() - start_time
    print(f"runMultipleFetches2 took: {elapsed_time:.2f} seconds")

asyncio.run(runMultipleFetches2())
asyncio.run(runMultipleFetches())