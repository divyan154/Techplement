from fastapi import FastAPI, Depends
import httpx
import os  #  Required for reading environment variables
from fastapi.middleware.cors import CORSMiddleware  
from dotenv import load_dotenv

from sqlalchemy.orm import Session
from . import models
from .database import SessionLocal, engine

# Load .env variables
load_dotenv()

# Read FRONTEND_URL from .env
frontend_url = os.getenv('FRONTEND_URL')  

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", frontend_url],  #  frontend origin from env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/quotes/random")
async def get_random_quote(db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        response = await client.get("https://zenquotes.io/api/random")
        data = response.json()

        content = data[0].get("q")
        author = data[0].get("a")

        # Save to DB
        quote = models.Quote(text=content, author=author)
        db.add(quote)
        db.commit()
        db.refresh(quote)

        return {
            "message": "Quote saved successfully",
            "quote": {
                "id": quote.id,
                "text": quote.text,
                "author": quote.author
            }
        }
@app.get("/quotes/all")
def get_all_quotes(db: Session = Depends(get_db)):
    quotes = db.query(models.Quote).all()
    return [
        {
            "id": quote.id,
            "text": quote.text,
            "author": quote.author
        }
        for quote in quotes
    ]
