from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_mysqldb import MySQL
from flask_dotenv import Dotenv  # Import the flask-dotenv extension

# Initialize Flask app
app = Flask(__name__)

# Load environment variables from .env
dotenv = Dotenv(app)
dotenv.load_dotenv()

# Database configuration
app.config['MYSQL_HOST'] = app.config.get('MYSQL_HOST')
app.config['MYSQL_USER'] = app.config.get('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = app.config.get('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = app.config.get('MYSQL_DB')
app.config['MYSQL_PORT'] = int(app.config.get('MYSQL_PORT'))

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
    app.run(debug=True, host="0.0.0.0")

