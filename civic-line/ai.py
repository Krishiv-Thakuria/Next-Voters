def classifyText(client, text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Classify the bill into: Immigration, Economy, or Civil. Return ONLY the category name."},
            {"role": "user", "content": text}
        ],
        max_tokens=5
    )
    return response.choices[0].message["content"].strip()

def summarizeText(client, text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Summarize this legislation in 2–3 sentences, neutrally, with no opinions."},
            {"role": "user", "content": text}
        ],
    )
    return response.choices[0].message["content"].strip()
