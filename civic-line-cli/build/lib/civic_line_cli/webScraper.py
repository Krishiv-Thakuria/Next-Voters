# -----------------------------------------------------------
# web_scraper.py — Contains ONLY scraping-related functions (NYC legislation)
# -----------------------------------------------------------

import requests
from bs4 import BeautifulSoup
from io import BytesIO
from docx import Document
from ai import classifyText, summarizeText

def scrapeCouncilMeetings():
    requestUrl = "https://legistar.council.nyc.gov/Calendar.aspx?Mode=Last+Month"
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
    """
    classifyText and summarizeText come from your OpenAI helpers.
    """
    categories = {"Immigration": [], "Economy": [], "Civil": []}
    processed_bills = set()  # Track bill IDs we've already processed
    
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
                
                # Metadata
                fileNumber = soup.find('span', id="ctl00_ContentPlaceHolder1_lblFile2").get_text(strip=True)
                
                # Check if already processed
                if fileNumber in processed_bills:
                    continue
                
                # Attachments
                attachments = soup.find('span', id="ctl00_ContentPlaceHolder1_lblAttachments2")
                if not attachments:
                    print(f"No attachments found for {fileLocator}")
                    continue
                    
                pdfLinks = attachments.find_all('a')
                if len(pdfLinks) < 3:
                    print(f"Not enough PDF links for {fileLocator}")
                    continue
                
                # Download PDF
                pdfUrl = pdfLinks[2]['href']
                pdfBytes = requests.get(f"https://legistar.council.nyc.gov/{pdfUrl}").content
                doc = Document(BytesIO(pdfBytes))
                fullText = "\n".join(p.text for p in doc.paragraphs)
                
                # Check if we actually got text
                if not fullText.strip():
                    print(f"Warning: No text extracted from {fileLocator}")
                    continue
                
                name = soup.find('span', id="ctl00_ContentPlaceHolder1_lblName2").get_text(strip=True)
                
                # FIX: Extract text from sponsor links instead of keeping BeautifulSoup objects
                sponsorsSpan = soup.find('span', id="ctl00_ContentPlaceHolder1_lblSponsors2")
                sponsors = [a.get_text(strip=True) for a in sponsorsSpan.find_all('a')] if sponsorsSpan else []
                
                # Call AI functions
                category = classifyText(fullText)
                summary = summarizeText(fullText)
                
                if category in categories:
                    categories[category].append({
                        "name": name,
                        "fileNumber": fileNumber,
                        "summarized": summary,
                        "sponsors": sponsors
                    })
                    
                    # Mark as processed
                    processed_bills.add(fileNumber)
                    
            except Exception as e:
                print(f"Error processing bill {fileLocator}: {e}")
    
    return categories