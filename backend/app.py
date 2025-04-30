from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import bcrypt
import os

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DB'),
        port=int(os.getenv('MYSQL_PORT', 3306))
    )

# JWT setup
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "super-secret")
jwt = JWTManager(app)

def create_tables():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(255) PRIMARY KEY,
                rfid_id VARCHAR(255) UNIQUE,
                password_hash TEXT NOT NULL,
                role ENUM('student', 'teacher') NOT NULL
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS class_sessions (
                session_id VARCHAR(255) PRIMARY KEY,
                course_code VARCHAR(50) NOT NULL,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS class_log (
                session_id VARCHAR(255),
                user_id VARCHAR(255),
                status ENUM('pending', 'present', 'absent') DEFAULT 'pending',
                PRIMARY KEY (session_id, user_id),
                FOREIGN KEY (session_id) REFERENCES class_sessions(session_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS attendance (
                student_id VARCHAR(255),
                date DATETIME NOT NULL,
                status ENUM('pending', 'present', 'absent') DEFAULT 'pending',
                PRIMARY KEY (student_id, date),
                FOREIGN KEY (student_id) REFERENCES users(user_id)
            )
        """)

        # Hash passwords with bcrypt
        student_password = "student123"
        teacher_password = "teacher123"
        student_hash = bcrypt.hashpw(student_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        teacher_hash = bcrypt.hashpw(teacher_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Add RFID-tagged users
        cursor.execute("""
            INSERT IGNORE INTO users (user_id, rfid_id, password_hash, role)
            VALUES 
                ('s001', 'RFID123STUDENT', %s, 'student'),
                ('t001', 'RFID123TEACHER', %s, 'teacher')
        """, (student_hash, teacher_hash))

        # Add 3 attendance records for student
        cursor.execute("""
            INSERT IGNORE INTO attendance (student_id, date, status)
                VALUES
                ('s001', CURDATE() - INTERVAL 2 DAY, 'present'),
                ('s001', CURDATE() - INTERVAL 1 DAY, 'absent'),
                ('s001', CURDATE(), 'present');
        """)
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database tables checked/created.")
    except Exception as e:
        print("❌ Error creating tables:", str(e))

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    rfid_id = data.get('rfid_id')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT user_id, password_hash, role FROM users WHERE rfid_id = %s", (rfid_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()

    if not result:
        return jsonify({"msg": "User not found"}), 404

    user_id, hashed_pw, role = result
    if not bcrypt.checkpw(password.encode('utf-8'), hashed_pw.encode('utf-8')):
        return jsonify({"msg": "Incorrect password"}), 401

    access_token = create_access_token(identity=user_id, additional_claims={"role": role})
    return jsonify(access_token=access_token), 200


@app.route('/attendance', methods=['GET'])
@jwt_required()
def get_attendance():
    user_id = get_jwt_identity()
    role = get_jwt()["role"]

    conn = get_db_connection()
    cur = conn.cursor()

    if role == 'teacher':
        cur.execute("SELECT * FROM attendance")
    else:
        cur.execute("SELECT * FROM attendance WHERE student_id = %s", (user_id,))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    attendance = [{"student_id": row[0], "date": str(row[1]), "status": row[2]} for row in rows]
    return jsonify(attendance)


# ✅ MARK ATTENDANCE
@app.route('/attendance', methods=['POST'])
@jwt_required()
def mark_attendance():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    role = identity.get('role')

    # Allow students to only mark themselves
    data = request.get_json()
    student_id = data.get("student_id")

    if role != 'teacher' and student_id != user_id:
        return jsonify({"msg": "Not authorized"}), 403

    status = data.get("status", "Present")
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO attendance (student_id, date, status) VALUES (%s, NOW(), %s)", (student_id, status))
    mysql.connection.commit()
    cur.close()

    return jsonify({"msg": "Attendance marked successfully"})

# ✅ EDIT ATTENDANCE (Only for teachers)
@app.route('/attendance/<int:student_id>', methods=['PUT'])
@jwt_required()
def update_attendance(student_id):
    identity = get_jwt_identity()
    if identity.get('role') != 'teacher':
        return jsonify({"msg": "Only teachers can edit attendance"}), 403

    data = request.get_json()
    date = data.get("date")
    status = data.get("status")

    if not (date and status):
        return jsonify({"msg": "Date and new status required"}), 400

    cur = mysql.connection.cursor()
    cur.execute("UPDATE attendance SET status = %s WHERE student_id = %s AND date = %s", (status, student_id, date))
    mysql.connection.commit()
    cur.close()

    return jsonify({"msg": "Attendance updated"})

# ✅ RUN APP
if __name__ == "__main__":
    with app.app_context():
        create_tables()
        app.run(port=5001, debug=True)
