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
            price INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0)
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

def get_records():
    conn = sqlite3.connect("carservis.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM records ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def update_record(status, price, record_id):
    conn = sqlite3.connect("carservis.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE records SET status = ?, price = ? WHERE id = ? AND is_deleted = 0
    """, (status, price, record_id))

    conn.commit()
    conn.close()

def delete_record(record_id):
    conn = sqlite3.connect("carservis.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE records SET is_deleted = 1 WHERE id = ?
    """, (record_id,))

    conn.commit()
    conn.close()