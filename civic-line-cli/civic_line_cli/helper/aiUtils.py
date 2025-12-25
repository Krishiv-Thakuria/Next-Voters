from openai import AsyncOpenAI
from pathlib import Path
from .storedValues import get_secret

# Intialize OpenAI at module level for reuse
_client = None

BASE_DIR = Path(__file__).parent
PROMPTS_DIR = BASE_DIR / "prompts"


def loadPrompt(fileName: str) -> str:
    path = PROMPTS_DIR / fileName
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


def initializeClient():
    global _client
    if _client is None:  
        api_key = get_secret("open_ai_key")
        _client = AsyncOpenAI(api_key=api_key)
    return _client


async def classifyText(fullText):
    client = initializeClient()
    political_text_classifier = loadPrompt("political_text_classifier.txt")
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Classify the legislation into: Immigration, Economy, or Civil. Return ONLY the category name."
            },
            {
                "role": "user",
                "content": f"{political_text_classifier}\n\n{fullText}"
            }
        ],
        max_tokens=5
    )
    return response.choices[0].message.content.strip()


async def summarizeText(fullText):
    client = initializeClient()
    political_text_summarizer = loadPrompt("political_text_summarizer.txt")
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Summarize this legislation in 2–3 sentences, neutrally, with no opinions."
            },
            {
                "role": "user",
                "content": f"{political_text_summarizer}\n\n{fullText}"
            }
        ],
    )
    return response.choices[0].message.content.strip()

async def runAIOnBill(bill):
    name = bill["name"]
    fileNumber = bill["fileNumber"]
    fullText = bill["fullText"]
    sponsors = bill["sponsors"]

    category = await classifyText(fullText)
    summary = await summarizeText(fullText)

    return category, name, fileNumber, summary, sponsors

