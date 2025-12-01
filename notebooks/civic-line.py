# Script for Civic Line
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

# -----------------------------
# Load Environment Variables
# -----------------------------
load_dotenv()

open_ai_key = os.getenv("OPENAI_KEY")
gmail_email = os.getenv("APP_GMAIL_EMAIL")
gmail_app_password = os.getenv("APP_GMAIL_PWD")
postgres_connection_string = os.getenv("POSTGRES_CONNECTION_STRING")

# -----------------------------
# Load Prompt Files
# -----------------------------
with open("political_text_classifier.txt", "r", encoding="utf-8") as file:
    political_text_classifier = file.read()

with open("political_text_summarizer.txt", "r", encoding="utf-8") as file:
    political_text_summarizer = file.read()

# -----------------------------
# OpenAI Client
# -----------------------------
client = OpenAI(api_key=open_ai_key)

def classifyText(input_text):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": political_text_classifier},
            {"role": "user", "content": input_text}
        ]
    )
    return response.choices[0].message.content.strip().split()[0]

def summarizeText(input_text):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": political_text_summarizer},
            {"role": "user", "content": "Summarize the following legislation: " + input_text}
        ]
    )
    return response.choices[0].message.content.strip()

# -----------------------------
# Scrape NYC Council Calendar
# -----------------------------
request_url = "https://legistar.council.nyc.gov/Calendar.aspx?Mode=Last+Week"
web_html = requests.get(request_url).text
soup = BeautifulSoup(web_html, "html.parser")

table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridCalendar_ctl00')
council_meetings = []

for tr in table.find_all('tr')[1:]:
    cells = tr.find_all('td')
    if not cells or len(cells) < 7:
        continue

    committee = cells[0].get_text(strip=True)
    date = cells[1].get_text(strip=True)
    meeting_time = cells[3].get_text(strip=True)

    if meeting_time == "Deferred":
        continue

    meeting_detail = cells[6].find('a')
    if meeting_detail:
        meeting_detail_aspx = meeting_detail['href']
    else:
        continue

    if len(council_meetings) < 2:
        council_meetings.append({
            'Date': date,
            'Committee': committee,
            'Meeting Details': meeting_detail_aspx
        })
    else:
        break

# -----------------------------
# Classification Categories
# -----------------------------
categories = {
    "Immigration": [],
    "Economy": [],
    "Civil": []
}

# -----------------------------
# Pull Each Meeting's Legislation
# -----------------------------
for meeting in council_meetings:
    meeting_details_url = f"https://legistar.council.nyc.gov/{meeting['Meeting Details']}"
    meeting_details_html = requests.get(meeting_details_url).text
    soup = BeautifulSoup(meeting_details_html, "html.parser")

    table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridMain_ctl00')
    if not table:
        continue

    legislation_file = []

    for tr in table.find_all('tr')[1:]:
        cells = tr.find_all('td')
        if len(cells) < 7:
            continue

        file_type = cells[6].get_text(strip=True)
        if file_type != "Introduction":
            continue

        locator_link = cells[0].find('a')
        if not locator_link:
            continue

        file_locator = locator_link['href']

        if len(legislation_file) > 2:
            break

        legislation_file.append(file_locator)

    # Scrape each bill
    for file_locator in legislation_file:
        response = requests.get(f"https://legistar.council.nyc.gov/{file_locator}").text
        soup = BeautifulSoup(response, "html.parser")

        attachments_span = soup.find('span', id="ctl00_ContentPlaceHolder1_lblAttachments2")
        if not attachments_span:
            continue

        pdf_links = attachments_span.find_all('a')
        if len(pdf_links) < 3:
            continue

        legislation_pdf_link = pdf_links[2]['href']

        # Metadata
        file_number = soup.find('span', id="ctl00_ContentPlaceHolder1_lblFile2").get_text(strip=True)
        status = soup.find('span', id="ctl00_ContentPlaceHolder1_lblStatus2").get_text(strip=True)
        sponsors_span = soup.find('span', id="ctl00_ContentPlaceHolder1_lblSponsors2")
        sponsors = sponsors_span.find_all("a") if sponsors_span else []
        name = soup.find('span', id="ctl00_ContentPlaceHolder1_lblName2").get_text(strip=True)

        # Get Bill Text
        fetched_document = requests.get(f"https://legistar.council.nyc.gov/{legislation_pdf_link}")
        doc = Document(BytesIO(fetched_document.content))
        legislation_text = '\n'.join([para.text for para in doc.paragraphs])

        category = classifyText(legislation_text)
        summarized = summarizeText(legislation_text)

        categories[category].append({
            "Name": name,
            "File Number": file_number,
            "Summarized": summarized,
            "Sponsors": sponsors
        })

# -----------------------------
# Fetch Email Subscribers
# -----------------------------
connection = psycopg2.connect(postgres_connection_string)
df = pd.read_sql_query("SELECT email FROM email_subscriptions;", connection)
recipients = df['email'].tolist()
connection.close()

print("Recipients loaded:", recipients)

# -----------------------------
# HTML Rendering Utilities
# -----------------------------
def parse_summary_to_bullets(summary):
    lines = [line.strip()[1:].strip() for line in summary.split('\n') if line.strip().startswith('*')]
    if not lines:
        return f'<p>{summary}</p>'
    bullets = ''.join([f'<li>{line}</li>' for line in lines])
    return f'<ul>{bullets}</ul>'

def render_sponsors(sponsors):
    if not sponsors:
        return "Unknown"
    return ', '.join([s.get_text(strip=True) for s in sponsors])

def render_bills(category_name):
    bills = categories.get(category_name, [])
    if not bills:
        return '<p style="color: #737373; font-style: italic;">No legislation to report this week.</p>'

    bills_html = ""
    for bill in bills:
        summary_html = parse_summary_to_bullets(bill['Summarized'])

        bills_html += f'''
            <div class="bill-item">
                <div>
                    <span class="bill-name">{bill['Name']}</span>
                    <br><br>
                    <span class="file-number">{bill['File Number']}</span>
                </div>

                <br>
                <span class="sponsors-body">{render_sponsors(bill['Sponsors'])}</span>
                <br><br>

                <div class="bill-summary">
                    {summary_html}
                </div>
            </div>
        '''
    return bills_html

# -----------------------------
# Build HTML Email
# -----------------------------

def returnHTML(email):
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    ...
    </head>
    <body>
        <div class="container">
            <div class="content">
    
                <div class="section">
                    <h2 class="section-title">Immigration</h2>
                    {render_bills('Immigration')}
                </div>
    
                <div class="section">
                    <h2 class="section-title">Civil Rights</h2>
                    {render_bills('Civil')}
                </div>
    
                <div class="section">
                    <h2 class="section-title">Economy</h2>
                    {render_bills('Economy')}
                </div>
    
            </div>
            <div class="footer">
                © Next Voters <a href="https://nextvoters.com/remove-recipient?email={email}">Unsubscribe</a>
            </div>
        </div>
    </body>
    </html>
    """

    return html

# -----------------------------
# Send Emails
# -----------------------------
SENDER_EMAIL = gmail_email
SENDER_PASSWORD = gmail_app_password
SUBJECT = "Civic Line - New York City Update"

for recipient_email in recipients:
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = SUBJECT
        msg['From'] = SENDER_EMAIL
        msg['To'] = recipient_email

        msg.attach(MIMEText(returnHTML(recipient_email), 'html'))

        print(f"Connecting to SMTP for {recipient_email}...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.set_debuglevel(1)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        print(f"✓ Sent to {recipient_email}")
        server.quit()

    except smtplib.SMTPAuthenticationError:
        print("Authentication failed. Make sure your Gmail App Password is valid.")
    except Exception as e:
        print(f"Error sending to {recipient_email}: {e}")

print("All emails processed.")
