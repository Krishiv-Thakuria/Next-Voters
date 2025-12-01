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

# Load Environment Variables
load_dotenv()

openAiKey = os.getenv("OPENAI_KEY")
gmailEmail = os.getenv("APP_GMAIL_EMAIL")
gmailAppPassword = os.getenv("APP_GMAIL_PWD")
postgresConnectionString = os.getenv("POSTGRES_CONNECTION_STRING")

# Load Prompt Files
with open("political_text_classifier.txt", "r", encoding="utf-8") as file:
    politicalTextClassifier = file.read()

with open("political_text_summarizer.txt", "r", encoding="utf-8") as file:
    politicalTextSummarizer = file.read()

# OpenAI Client
client = OpenAI(api_key=openAiKey)

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

# Scrape NYC Council Calendar
requestUrl = "https://legistar.council.nyc.gov/Calendar.aspx?Mode=Last+Week"
webHtml = requests.get(requestUrl).text
soup = BeautifulSoup(webHtml, "html.parser")

table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridCalendar_ctl00')
councilMeetings = []

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

        if len(councilMeetings) < 2:
            councilMeetings.append({
                'date': date,
                'committee': committee,
                'meetingDetails': meetingDetail['href']
            })
        else:
            break

# Classification Categories
categories = {
    "Immigration": [],
    "Economy": [],
    "Civil": []
}

# Pull Each Meeting's Legislation
for meeting in councilMeetings:
    meetingDetailsUrl = f"https://legistar.council.nyc.gov/{meeting['meetingDetails']}"
    meetingDetailsHtml = requests.get(meetingDetailsUrl).text
    soup = BeautifulSoup(meetingDetailsHtml, "html.parser")

    table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridMain_ctl00')
    if not table:
        continue

    legislationFiles = []

    for tr in table.find_all('tr')[1:]:
        cells = tr.find_all('td')
        if len(cells) < 7:
            continue

        fileType = cells[6].get_text(strip=True)
        if fileType != "Introduction":
            continue

        locatorLink = cells[0].find('a')
        if not locatorLink:
            continue

        if len(legislationFiles) >= 3:
            break

        legislationFiles.append(locatorLink['href'])

    # Scrape each bill
    for fileLocator in legislationFiles:
        try:
            response = requests.get(f"https://legistar.council.nyc.gov/{fileLocator}").text
            soup = BeautifulSoup(response, "html.parser")

            attachmentsSpan = soup.find('span', id="ctl00_ContentPlaceHolder1_lblAttachments2")
            if not attachmentsSpan:
                continue

            pdfLinks = attachmentsSpan.find_all('a')
            if len(pdfLinks) < 3:
                continue

            legislationPdfLink = pdfLinks[2]['href']

            # Metadata
            fileNumber = soup.find('span', id="ctl00_ContentPlaceHolder1_lblFile2").get_text(strip=True)
            status = soup.find('span', id="ctl00_ContentPlaceHolder1_lblStatus2").get_text(strip=True)
            sponsorsSpan = soup.find('span', id="ctl00_ContentPlaceHolder1_lblSponsors2")
            sponsors = sponsorsSpan.find_all("a") if sponsorsSpan else []
            name = soup.find('span', id="ctl00_ContentPlaceHolder1_lblName2").get_text(strip=True)

            # Get Bill Text
            fetchedDocument = requests.get(f"https://legistar.council.nyc.gov/{legislationPdfLink}")
            doc = Document(BytesIO(fetchedDocument.content))
            legislationText = '\n'.join([para.text for para in doc.paragraphs])

            category = classifyText(legislationText)
            summarized = summarizeText(legislationText)

            if category in categories:
                categories[category].append({
                    "name": name,
                    "fileNumber": fileNumber,
                    "summarized": summarized,
                    "sponsors": sponsors
                })
        except Exception as e:
            print(f"Error processing bill {fileLocator}: {e}")
            continue

# Fetch Email Subscribers
connection = psycopg2.connect(postgresConnectionString)
df = pd.read_sql_query("SELECT email FROM email_subscriptions;", connection)
recipients = df['email'].tolist()
connection.close()

print(f"Recipients loaded: {len(recipients)}")

# HTML Rendering Utilities
def parseSummaryToBullets(summary):
    lines = [line.strip()[1:].strip() for line in summary.split('\n') if line.strip().startswith('*')]
    if not lines:
        return f'<p>{summary}</p>'
    bullets = ''.join([f'<li>{line}</li>' for line in lines])
    return f'<ul>{bullets}</ul>'

def renderSponsors(sponsors):
    if not sponsors:
        return "Unknown"
    return ', '.join([s.get_text(strip=True) for s in sponsors])

def renderBills(categoryName):
    bills = categories.get(categoryName, [])
    if not bills:
        return '<p style="color: #737373; font-style: italic;">No legislation to report this week.</p>'

    billsHtml = ""
    for bill in bills:
        summaryHtml = parseSummaryToBullets(bill['summarized'])

        billsHtml += f'''
            <div class="bill-item">
                <div>
                    <span class="bill-name">{bill['name']}</span>
                    <br><br>
                    <span class="file-number">{bill['fileNumber']}</span>
                </div>

                <br>
                <span class="sponsors-body">{renderSponsors(bill['sponsors'])}</span>
                <br><br>

                <div class="bill-summary">
                    {summaryHtml}
                </div>
            </div>
        '''
    return billsHtml

# Build HTML Email
def returnHtml(email):
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
            .container {{ max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }}
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
                    {renderBills('Immigration')}
                </div>
    
                <div class="section">
                    <h2 class="section-title">Civil Rights</h2>
                    {renderBills('Civil')}
                </div>
    
                <div class="section">
                    <h2 class="section-title">Economy</h2>
                    {renderBills('Economy')}
                </div>
    
            </div>
            <div class="footer">
                © Next Voters | <a href="https://nextvoters.com/remove-recipient?email={email}">Unsubscribe</a>
            </div>
        </div>
    </body>
    </html>
    """
    return html

# Send Emails
senderEmail = gmailEmail
senderPassword = gmailAppPassword
subject = "Civic Line - New York City Update"

for recipientEmail in recipients:
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = senderEmail
        msg['To'] = recipientEmail

        msg.attach(MIMEText(returnHtml(recipientEmail), 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(senderEmail, senderPassword)
        server.send_message(msg)
        print(f"✓ Sent to {recipientEmail}")
        server.quit()

    except smtplib.SMTPAuthenticationError:
        print("Authentication failed. Check your Gmail App Password.")
        break
    except Exception as e:
        print(f"Error sending to {recipientEmail}: {e}")

print("All emails processed.")
