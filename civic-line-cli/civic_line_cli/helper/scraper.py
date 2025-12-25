from bs4 import BeautifulSoup
from io import BytesIO
from docx import Document
from ..globalStates import meetings, categories, resultsHTML, bills, fileLocaters

def scrapeCouncilMeetings(html):
    soup = BeautifulSoup(html, "html.parser")

    table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridCalendar_ctl00')

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

            print("Date:", date)
            print("Committee:", committee)
            print("Meeting details:", meetingDetail['href'])

            # Ignore after 2 meetings 
            if len(meetings) >= 2:
                break 

def scrapeEachBill(html):
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridMain_ctl00')
    
    if not table:
        return bills
    
    legislationFiles = []
    for tr in table.find_all('tr')[1:]:
        cells = tr.find_all('td')
        if len(cells) < 7 or cells[6].get_text(strip=True) != "Introduction":
            continue
        locator = cells[0].find('a')
        if locator:
            legislationFiles.append(locator['href'])
        if len(legislationFiles) >= 3:
            break

    fileLocaters.extend(legislationFiles)

def scrapeLegislations():
    for html in resultsHTML:
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridMain_ctl00')
        
        if not table:
            return categories
        
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
                scrapeEachBill(fileLocator)
            except Exception as e:
                print(f"Error processing bill {fileLocator}: {e}")

def scrapeFileContent(html): 
        try:
            soup = BeautifulSoup(html, "html.parser")
            
            fileNumber = soup.find('span', id="ctl00_ContentPlaceHolder1_lblFile2").get_text(strip=True)
            attachments = soup.find('span', id="ctl00_ContentPlaceHolder1_lblAttachments2")
            
            if not attachments:
                return
            
            pdfLinks = attachments.find_all('a')
            if len(pdfLinks) < 3:
                return
            
            pdfUrl = pdfLinks[2]['href']
            pdfBytes = requests.get(f"https://legistar.council.nyc.gov/{pdfUrl}").content
            doc = Document(BytesIO(pdfBytes))
            fullText = "\n".join(p.text for p in doc.paragraphs)
            
            if not fullText.strip():
                return
            
            name = soup.find('span', id="ctl00_ContentPlaceHolder1_lblName2").get_text(strip=True)
            sponsorsSpan = soup.find('span', id="ctl00_ContentPlaceHolder1_lblSponsors2")
            sponsors = [a.get_text(strip=True) for a in sponsorsSpan.find_all('a')] if sponsorsSpan else []
            
            bills.append({
                "name": name,
                "fileNumber": fileNumber,
                "fullText": fullText,
                "sponsors": sponsors
            })
            print("Name:", name)
            print("File Number", fileNumber)
            
        except Exception as e:
            print(f"Error processing bill: {e}")
    