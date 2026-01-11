from bs4 import BeautifulSoup
from ..globalStates import meetings, legislationDetailsHTML, meetingDetailsHTML, bills, fileLocaters

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

def scrapeMeetingDetails():
    for html in meetingDetailsHTML:
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find('table', id='ctl00_ContentPlaceHolder1_gridMain_ctl00')
        
        if not table:
            continue
        
        count = 0
        for tr in table.find_all('tr')[1:]:
            cells = tr.find_all('td')
            if len(cells) < 7:
                continue
            if cells[6].get_text(strip=True) != "Introduction":
                continue
            
            locator = cells[0].find('a')
            if locator:
                fileLocaters.append(locator['href'])
                count += 1
                if count >= 3:
                    break

def scrapeLegislationDetail(): 
        for html in legislationDetailsHTML:
            try:
                soup = BeautifulSoup(html, "html.parser")
                
                fileNumber = soup.find('span', id="ctl00_ContentPlaceHolder1_lblFile2").get_text(strip=True)
                attachments = soup.find('span', id="ctl00_ContentPlaceHolder1_lblAttachments2")
                
                if not attachments:
                    return
                
                pdfLinks = attachments.find_all('a')
                if len(pdfLinks) < 3:
                    return

                billTextContainer = soup.find('div', id="ctl00_ContentPlaceHolder1_divText")
                paragraphs = billTextContainer.find_all('p') 
                fullText = "\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))

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
                
            except Exception as e:
                print(f"Error processing bill: {e}")
        