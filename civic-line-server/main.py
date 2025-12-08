from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scrapper_utils import perform_scrape, 
from typing import Optional, Dict, Any, List
import uvicorn

app = FastAPI(title="AI Legislation Scraper API")

# CORS middleware - allows requests from your Vercel app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ScrapeRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = {}
    date_range: Optional[Dict[str, str]] = {}

# Response model
class ScrapeResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@app.get("/")
async def root():
    return {
        "message": "AI Legislation Scraper API",
        "status": "running",
        "endpoints": {
            "scrape": "/scrape (POST)"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/scrape", response_model=ScrapeResponse)
async def scrape_legislation(request: ScrapeRequest):
    """
    Main scraping endpoint
    
    Example request:
    {
        "query": "AI regulations",
        "filters": {
            "country": "US",
            "type": "federal"
        },
        "date_range": {
            "start": "2024-01-01",
            "end": "2024-12-31"
        }
    }
    """
    try:
        # TODO: Implement your actual scraping logic here
        results = perform_scrape(
            query=request.query,
            filters=request.filters,
            date_range=request.date_range
        )
        
        return ScrapeResponse(
            success=True,
            data=results
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scraping failed: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload during development
    )
