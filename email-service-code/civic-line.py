# -----------------------------------------------------------
# Imports & Environment Setup
# -----------------------------------------------------------

from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
from io import BytesIO
from docx import Document
from openai import OpenAI
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt

load_dotenv()

openAiKey = os.getenv("OPENAI_KEY")
gmailEmail = os.getenv("APP_GMAIL_EMAIL")
gmailAppPassword = os.getenv("APP_GMAIL_PWD")
postgresConnectionString = os.getenv("POSTGRES_CONNECTION_STRING")
secretKey = os.getenv("JWT_SECRET_KEY")

with open("political_text_classifier.txt", "r", encoding="utf-8") as file:
    politicalTextClassifier = file.read()

with open("political_text_summarizer.txt", "r", encoding="utf-8") as file:
    politicalTextSummarizer = file.read()

client = OpenAI(api_key=openAiKey)


# -----------------------------------------------------------
# OpenAI Helpers
# -----------------------------------------------------------

def classifyText(inputText):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": politicalTextClassifier},
            {"role": "user", "content": inputText}
        ]
    )
    return response.choices[0].message.content.strip().split()[0]


def summarizeText(inputText):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": politicalTextSummarizer},
            {"role": "user", "content": f"Summarize the following legislation: {inputText}"}
        ]
    )
    return response.choices[0].message.content.strip()


# -----------------------------------------------------------
# JWT Helper
# -----------------------------------------------------------

def assignJwt(email):
    payload = {
        "email": email,
        "exp": int(__import__("time").time()) + 600  # 10 min expiry
    }
    return jwt.encode(payload, secretKey, algorithm="HS256")


# -----------------------------------------------------------
# HTML Helpers
# -----------------------------------------------------------

def parseSummaryToBullets(summary):
    bullet_lines = [
        line.strip()[1:].strip()
        for line in summary.split("\n")
        if line.strip().startswith("*")
    ]

    if not bullet_lines:
        return f"<p>{summary}</p>"

    bullets = "".join(f"<li>{line}</li>" for line in bullet_lines)
    return f"<ul>{bullets}</ul>"


def renderSponsors(sponsors):
    if not sponsors:
        return "Unknown"
    return ", ".join(s.get_text(strip=True) for s in sponsors)


def renderBills(categoryName, categories):
    bills = categories.get(categoryName, [])
    if not bills:
        return '<p style="color: #737373; font-style: italic;">No legislation to report this week.</p>'

    html = ""
    for bill in bills:
        summaryHtml = parseSummaryToBullets(bill['summarized'])
        html += f"""
            <div class="bill-item">
                <span class="bill-name">{bill['name']}</span><br><br>
                <span class="file-number">{bill['fileNumber']}</span>
                <br><br>
                <span class="sponsors-body">{renderSponsors(bill['sponsors'])}</span>
                <br><br>
                <div class="bill-summary">{summaryHtml}</div>
            </div>
        """
    return html


def returnHtml(jwtToken, categories):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
            .container {{ max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; }}
            .content {{ padding: 30px; }}
            .section {{ margin-bottom: 30px; }}
            .section-title {{ color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }}
            .bill-item {{ background-color: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 5px; }}
            .bill-name {{ font-weight: bold; color: #2c3e50; }}
            .file-number {{ color: #7f8c8d; font-size: 0.9em; }}
            .sponsors-body {{ color: #34495e; font-style: italic; }}
            .bill-summary {{ color: #2c3e50; line-height: 1.6; }}
            .footer {{ background-color: #34495e; color: #ffffff; padding: 15px; text-align: center; }}
            .footer a {{ color: #3498db; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">

                <div class="section">
                    <h2 class="section-title">Immigration</h2>
                    {renderBills('Immigration', categories)}
                </div>

                <div class="section">
                    <h2 class="section-title">Civil Rights</h2>
                    {renderBills('Civil', categories)}
                </div>

                <div class="section">
                    <h2 class="section-title">Economy</h2>
                    {renderBills('Economy', categories)}
                </div>

            </div>
            <div class="footer">
                © Next Voters | <a href="https://nextvoters.com/remove-recipient?token={jwtToken}">
                Unsubscribe (valid for 10 mins)</a>
            </div>
        </div>
    </body>
    </html>
    """


# -----------------------------------------------------------
# Scraping Logic
# -----------------------------------------------------------

def scrapeCouncilMeetings():
    requestUrl = "https://legistar.council.nyc.gov/Calendar.aspx?Mode=Last+Week"
    soup = BeautifulSoup(requests.get(requestUrl).text, "html.parser")

    table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridCalendar_ctl00')
    meetings = []

    if table:
        for tr in table.find_all('tr')[1:]:
            cells = tr.find_all('td')
            if len(cells) < 7:
                continue

            committee = cells[0].get_text(strip=True)
            date = cells[1].get_text(strip=True)
            meetingTime = cells[3].get_text(strip=True)

            if meetingTime == "Deferred":
                continue

            meetingDetail = cells[6].find('a')
            if not meetingDetail:
                continue

            meetings.append({
                "date": date,
                "committee": committee,
                "meetingDetails": meetingDetail['href']
            })

            if len(meetings) >= 2:
                break

    return meetings


def scrapeLegislation(meetings):
    categories = {"Immigration": [], "Economy": [], "Civil": []}

    for meeting in meetings:
        detailsUrl = f"https://legistar.council.nyc.gov/{meeting['meetingDetails']}"
        soup = BeautifulSoup(requests.get(detailsUrl).text, "html.parser")

        table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridMain_ctl00')
        if not table:
            continue

        legislationFiles = []

        for tr in table.find_all('tr')[1:]:
            cells = tr.find_all('td')
            if len(cells) < 7:
                continue

            if cells[6].get_text(strip=True) != "Introduction":
                continue

            locator = cells[0].find('a')
            if locator:
                legislationFiles.append(locator['href'])

            if len(legislationFiles) >= 3:
                break

        # Scrape each bill PDF
        for fileLocator in legislationFiles:
            try:
                billHtml = requests.get(f"https://legistar.council.nyc.gov/{fileLocator}").text
                soup = BeautifulSoup(billHtml, "html.parser")

                # Get attachments
                attachments = soup.find('span', id="ctl00_ContentPlaceHolder1_lblAttachments2")
                if not attachments:
                    continue
                pdfLinks = attachments.find_all('a')
                if len(pdfLinks) < 3:
                    continue

                pdfUrl = pdfLinks[2]['href']
                pdfBytes = requests.get(f"https://legistar.council.nyc.gov/{pdfUrl}").content
                doc = Document(BytesIO(pdfBytes))
                fullText = "\n".join(p.text for p in doc.paragraphs)

                # Metadata
                fileNumber = soup.find('span', id="ctl00_ContentPlaceHolder1_lblFile2").get_text(strip=True)
                name = soup.find('span', id="ctl00_ContentPlaceHolder1_lblName2").get_text(strip=True)
                sponsorsSpan = soup.find('span', id="ctl00_ContentPlaceHolder1_lblSponsors2")
                sponsors = sponsorsSpan.find_all('a') if sponsorsSpan else []

                category = classifyText(fullText)
                summary = summarizeText(fullText)

                if category in categories:
                    categories[category].append({
                        "name": name,
                        "fileNumber": fileNumber,
                        "summarized": summary,
                        "sponsors": sponsors
                    })
            except Exception as e:
                print(f"Error processing bill {fileLocator}: {e}")

    return categories


# -----------------------------------------------------------
# Email Sending Logic
# -----------------------------------------------------------

def sendEmails(categories):
    connection = psycopg2.connect(postgresConnectionString)
    df = pd.read_sql_query("SELECT email FROM email_subscriptions;", connection)
    recipients = df['email'].tolist()
    connection.close()

    senderEmail = gmailEmail
    senderPassword = gmailAppPassword
    subject = "Civic Line - New York City Update"

    print(f"Recipients loaded: {len(recipients)}")

    for email in recipients:
        try:
            token = assignJwt(email)

            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = senderEmail
            msg["To"] = email

            html = returnHtml(email, token, categories)
            msg.attach(MIMEText(html, "html"))

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(senderEmail, senderPassword)
            server.send_message(msg)
            server.quit()

            print(f"✓ Sent to {email}")

        except Exception as e:
            print(f"Error sending to {email}: {e}")


# -----------------------------------------------------------
# MAIN EXECUTION
# -----------------------------------------------------------

if __name__ == "__main__":
    meetings = scrapeCouncilMeetings()
    categories = scrapeLegislation(meetings)
    sendEmails(categories)
