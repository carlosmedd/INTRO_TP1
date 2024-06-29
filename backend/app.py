from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://user_test:Yrrz34cwppuyk@localhost:5432/users_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username, password=password).first()
    
    if user:
        return jsonify({
            "success": True, 
            "id": user.id,
            "nickname": user.nickname,
            "username": user.username,
            "password": user.password}), 200
    else:
        return jsonify({"success": False, "message": "Credenciales inválidas"}), 401 

if __name__ == '__main__':
    app.run(port=5000, debug=True)