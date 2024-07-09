from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Exercise

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://user_test:Yrrz34cwppuyk@localhost:5432/users_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
            "password": user.password
            }), 200
    else:
        return jsonify({"success": False, "message": "Credenciales inválidas"}), 401 

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    nickname = data.get('nickname')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return jsonify({"success" : False, "message": "El usuario ya existe"}), 400
    else:
        new_user = User(username=username, nickname=nickname, password=password)
        db.session.add(new_user)
        db.session.commit()

        user = User.query.filter_by(username=username, password=password).first()
        return jsonify({
            "success": True, 
            "id": user.id,
            "nickname": user.nickname,
            "username": user.username,
            "password": user.password
            }), 201

@app.route('/exercises', methods=['GET'])
def get_exercises():
    try:
        exercises = Exercise.query.all()
        exercises_data = []
        for exercise in exercises:
            exercise_data = {
                'id': exercise.id,
                'name': exercise.name,
                'img1': exercise.img1,
                'img2': exercise.img2
            }
            exercises_data.append(exercise_data)
            
        return jsonify({'exercises': exercises_data}), 200

    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(port=5000, debug=True)
