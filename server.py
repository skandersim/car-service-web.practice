from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from db import init_db, add_record

app = FastAPI()
init_db()

class RecordCreate(BaseModel):
    name: str
    phone: str
    servis: str
    date: str
    time: str

@app.post("/api/records")
def create_record(data: RecordCreate):
    add_record(data.name, data.phone, data.servis, data.date, data.time)
    return {"ok": True}

@app.get("/")
def main():
    return FileResponse("index.html")

app.mount("/", StaticFiles(directory="."), name="static")