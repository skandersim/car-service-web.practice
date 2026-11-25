from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from db import init_db, add_record, get_records, delete_record, update_record

app = FastAPI()
init_db()

class RecordCreate(BaseModel):
    name: str
    phone: str
    servis: str
    date: str
    time: str

class RecordUpdate(BaseModel):
    status: str
    price: int

@app.post("/api/records")
def create_record(data: RecordCreate):
    add_record(data.name, data.phone, data.servis, data.date, data.time)
    return {"ok": True}

@app.get("/")
def main():
    return FileResponse("templates/index.html")

@app.get("/admin")
def admin():
    return FileResponse("templates/admin.html")

@app.get("/api/records")
def get_record():
    return get_records()

@app.patch("/api/records/{record_id}")
def patch_record(record_id: int, data: RecordUpdate):
    return update_record(data.status, data.price, record_id)

@app.delete("/api/records/{record_id}")
def delete_records(record_id: int):
    return delete_record(record_id)

app.mount("/", StaticFiles(directory="."), name="static")
