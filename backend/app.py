from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Database configuration - GET DIRECTLY from os.environ
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT', 3306))  # Default to 3306 if not set

mysql = MySQL(app)

@app.route('/attendance', methods=['POST'])
def mark_attendance():
    student_id = request.json.get("student_id")
    if not student_id:
        return jsonify({"msg": "Student ID required"}), 400
    
    # Create a cursor and execute the SQL statement
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO attendance (student_id, date) VALUES (%s, NOW())", (student_id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({"msg": "Attendance marked successfully"}), 200

if __name__ == "__main__":
    app.run(port=5001)

