from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# ---------- DATABASE SETUP ----------
def init_db():
    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

init_db()

# ---------- ROUTES ----------

# Home Route
@app.route("/")
def home():
    return "Backend is running successfully!"


# ADD TASK (CREATE)
@app.route("/add", methods=["POST"])
def add_task():
    data = request.get_json()
    title = data.get("title")

    if not title:
        return jsonify({"error": "Title is required"}), 400

    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tasks (title) VALUES (?)", (title,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Task added successfully!"})


# GET ALL TASKS (READ)
@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()
    conn.close()

    tasks = []
    for row in rows:
        tasks.append({
            "id": row[0],
            "title": row[1],
            "completed": bool(row[2])
        })

    return jsonify(tasks)


# DELETE TASK
@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_task(id):
    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Task deleted successfully!"})


# UPDATE TASK (Mark Complete/Incomplete)
@app.route("/update/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.get_json()
    completed = data.get("completed")

    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE tasks SET completed=? WHERE id=?",
        (1 if completed else 0, id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Task updated successfully!"})


if __name__ == "__main__":
    app.run(debug=True)