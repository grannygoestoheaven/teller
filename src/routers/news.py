from fastapi import APIRouter
from .schema import NewsItem

router = APIRouter()

@router.get("/news/{topic}", response_model=list[NewsItem])
async def news_endpoint(topic: str):
    return await fetch_news(topic)