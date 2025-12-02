import psycopg2
from os import getenv
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

gmail_email = getenv("APP_GMAIL_EMAIL")
gmail_app_password = getenv("APP_GMAIL_PWD")
postgres_connection_string = getenv("POSTGRES_CONNECTION_STRING")

def buildEmailHtml(categories):
    html = """
    <html>
    <body>
        <h1>NYC Legislative Update</h1>
    """

    for category, bills in categories.items():
        html += f"<h2>{category}</h2>"
        if not bills:
            html += "<p>No new updates.</p>"
            continue

        for bill in bills:
            sponsors = ", ".join(a.get_text(strip=True) for a in bill["sponsors"])

            html += f"""
            <div>
                <h3>{bill["name"]} ({bill["fileNumber"]})</h3>
                <p><b>Summary:</b> {bill["summarized"]}</p>
                <p><b>Sponsors:</b> {sponsors}</p>
            </div>
            <hr>
            """

    html += "</body></html>"
    return html

# -----------------------------------------------------------
# Send Email Function
# -----------------------------------------------------------
def sendEmails(categories):
    conn = psycopg2.connect(postgres_connection_string)
    cursor = conn.cursor()

    cursor.execute("SELECT email FROM subscribers;")
    subscribers = cursor.fetchall()

    html_body = buildEmailHtml(categories)

    for (email,) in subscribers:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Weekly NYC Legislation Update"
        msg["From"] = gmail_email
        msg["To"] = email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_email, gmail_app_password)
            server.sendmail(gmail_email, email, msg.as_string())

    conn.close()