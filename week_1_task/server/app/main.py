from fastapi import FastAPI, Depends
import httpx

from fastapi.middleware.cors import CORSMiddleware  


from sqlalchemy.orm import Session
from . import models
from .database import SessionLocal, engine



 

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", https://techplement-y3v4.vercel.app],  #  frontend origin from env
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
