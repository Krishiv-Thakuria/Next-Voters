from openai import OpenAI
from storedValues import get_secret

# -----------------------------------------------------------
# Initialize OpenAI client once at module level 
# -----------------------------------------------------------
_client = None

def loadPrompt(fileName):
    with open(fileName, "r", encoding="utf-8") as file:
        return file.read()

def initializeClient():
    global _client
    if _client is None:  
        api_key = get_secret("open_ai_key")
        _client = OpenAI(api_key=api_key)
    return _client

def classifyText(fullText):
    client = initializeClient()
    political_text_classifier = loadPrompt("prompts/political_text_classifier.txt")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"Classify the legislation into: Immigration, Economy, or Civil. Return ONLY the category name: {fullText}"},
            {"role": "user", "content": political_text_classifier}
        ],
        max_tokens=5
    )
    return response.choices[0].message.content.strip()

def summarizeText(fullText):
    client = initializeClient()
    political_text_summarizer = loadPrompt("prompts/political_text_summarizer.txt")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"Summarize this legislation in 2–3 sentences, neutrally, with no opinions: {fullText}"},
            {"role": "user", "content": political_text_summarizer}
        ],
    )
    return response.choices[0].message.content.strip() 