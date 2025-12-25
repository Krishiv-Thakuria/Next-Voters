import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .storedValues import get_secret
from ..globalStates import categories

gmail_email = get_secret("gmail_email")
gmail_app_password = get_secret("gmail_app_password")
postgres_connection_string = get_secret("postgres_connection_string")


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
            sponsors = ", ".join(bill["sponsors"]) 
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


def sendEmails():
    # Use context manager for DB
    with psycopg2.connect(postgres_connection_string) as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT email FROM email_subscriptions;")
            subscribers = cursor.fetchall()
    
    html_body = buildEmailHtml(categories)
    
    # Open SMTP connection ONCE for all emails
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(gmail_email, gmail_app_password)
        
        for (email,) in subscribers:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "TESTING"
            msg["From"] = gmail_email
            msg["To"] = email
            msg.attach(MIMEText(html_body, "html"))
            
            server.sendmail(gmail_email, email, msg.as_string())
            print(f"Sent to {email}")