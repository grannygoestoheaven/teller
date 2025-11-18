from fastapi import FastAPI
from routers import home_ui, story

from datetime import datetime

app = fastAPI()
app.include_router(story.router)     # Not used in current logic, kept for reference
app.include_router(home_ui.router)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=False)
