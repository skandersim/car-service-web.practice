import sqlite3

def init_db():
    conn = sqlite3.connect("carservis.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS records
            (id INTEGER PRIMARY KEY,
            name TEXT,
            phone TEXT,
            servis TEXT,
            date TEXT,
            time TEXT,
            status TEXT DEFAULT 'new',
            price INTEGER DEFAULT 0)
    """)
    conn.commit()
    conn.close()

def add_record(name, phone, servis, date, time):
    conn = sqlite3.connect("carservis.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO records (name, phone, servis, date, time) VALUES (?, ?, ?, ?, ?)
    """, (name, phone, servis, date, time))

    conn.commit()
    conn.close()