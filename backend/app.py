import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Exercise, Comment, Response, Rutine, Exercise_user

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://gabriel:140703@localhost:5432/users_db'
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
            "password": user.password,
            "active_rutine_id": user.active_rutine_id
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

@app.route('/comments', methods=['POST'])
def add_comment():
    data = request.json
    comentario = data.get('comment')
    id = data.get('id')
    new_comment = Comment(comment = comentario, user_id = id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({
            "success": True, 
            }), 201

@app.route('/comments', methods=['PUT'])
def edit_comment():
    data = request.json
    comment_edt = data.get("comment_edt")
    id_comment = data.get("id_comment")
    new_date =datetime.datetime.now()
    comment = Comment.query.filter_by(id=id_comment).first()
    comment.comment = comment_edt
    comment.created = new_date
    db.session.commit()
    return jsonify({
            "success": True, 
            }), 201

@app.route('/comments', methods=['DELETE'])
def delete_comment():
    data = request.json
    id_comentario = data.get("id_comentario")
    comment = Comment.query.filter_by(id=id_comentario).first()
    for respuesta in comment.responses:
        res = Response.query.filter_by(id=respuesta.id).first()
        db.session.delete(res)
        db.session.commit()    
    db.session.delete(comment)
    db.session.commit()
    return jsonify({
            "success": True, 
            }), 201

@app.route('/comments')
def get_comments():
    try:
        comentarios = Comment.query.all()
        comentarios_data = []
        for comentario in comentarios:
            user = User.query.filter_by(id = comentario.user_id).first()
            comentario_data = {
                "id": comentario.id,
                "comment": comentario.comment,
                "name": user.nickname,
                "date": comentario.created,
                "user_id": user.id,
            }
            comentarios_data.append(comentario_data)

        return jsonify(comentarios_data)
    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/comments/<id>')
def get_comment(id):
    try:
        comentario = Comment.query.filter_by(id=id).first()
        user = User.query.filter_by(id = comentario.user_id).first()
        comentario_data = {
            "id": comentario.id,
            "comment": comentario.comment,
            "name": user.nickname,
            "date": comentario.created,
            "user_id": user.id,            
            "responses": []
        }
        for respuesta in comentario.responses:
            user_response = User.query.filter_by(id = respuesta.user_id).first()
            respuesta_data = {
                "id": respuesta.id,    
                "response": respuesta.response,
                "name": user_response.nickname,
                "user_id": user_response.id,
                "date": respuesta.created
            }
            comentario_data['responses'].append(respuesta_data)
        return jsonify(comentario_data)
    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/responses', methods=['POST'])
def add_response():
    data = request.json
    respuesta = data.get('response')
    id = data.get('id')
    comentario_id = data.get("id_comentario")
    new_response = Response(response = respuesta, user_id = id, comment_id = comentario_id)
    db.session.add(new_response)
    db.session.commit()
    return jsonify({
            "success": True, 
            }), 201

@app.route('/responses', methods=['PUT'])
def edit_response():
    data = request.json
    response_edt = data.get("response_edt")
    id_response = data.get("id_response")
    new_date =datetime.datetime.now()
    response = Response.query.filter_by(id=id_response).first()
    response.response = response_edt
    response.created = new_date
    db.session.commit()
    return jsonify({
            "success": True, 
            }), 201

@app.route('/responses', methods=['DELETE'])
def delete_response():
    data = request.json
    id_respuesta = data.get("id_response")
    response = Response.query.filter_by(id=id_respuesta).first()  
    db.session.delete(response)
    db.session.commit()
    return jsonify({
            "success": True, 
            }), 201

@app.route('/rutines')
def get_rutines():
    try:
        rutinas = Rutine.query.all()
        rutinas_data = []
        for rutina in rutinas:

            user = User.query.filter_by(id = rutina.user_id).first()
            rutina_data = {
                "id": rutina.id,
                "description": rutina.description, 
                "name_rutine": rutina.name,
                "name": user.nickname,
                "date": rutina.created_at.strftime("%x"),
                "Lunes": [],
                "Martes": [],
                "Miercoles": [],
                "Jueves": [],
                "Viernes": [],
                "Sabado": [],
                "Domingo": []
            }
            ejercicios = Exercise_user.query.filter_by(rutine_id = rutina.id).all()
            for ejercicio in ejercicios:
                if (ejercicio.day == 0):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Lunes'].append(ejercicio_day_data)
                if (ejercicio.day == 1):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Martes'].append(ejercicio_day_data)
                if (ejercicio.day == 2):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Miercoles'].append(ejercicio_day_data)
                if (ejercicio.day == 3):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Jueves'].append(ejercicio_day_data)
                if (ejercicio.day == 4):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Viernes'].append(ejercicio_day_data)
                if (ejercicio.day == 5):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Sabado'].append(ejercicio_day_data)
                if (ejercicio.day == 6):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Domingo'].append(ejercicio_day_data)

            rutinas_data.append(rutina_data)
        return jsonify(rutinas_data)
    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/rutines/search/<nombre>')
def get_rutines_name(nombre):
    try:
        rutinas = Rutine.query.filter(Rutine.name.startswith(nombre)).all()
        rutinas_data = []
        for rutina in rutinas:
            user = User.query.filter_by(id = rutina.user_id).first()
            rutina_data = {
                "id": rutina.id,
                "description": rutina.description, 
                "name_rutine": rutina.name,
                "name": user.nickname,
                "date": rutina.created_at.strftime("%x"),
                "Lunes": [],
                "Martes": [],
                "Miercoles": [],
                "Jueves": [],
                "Viernes": [],
                "Sabado": [],
                "Domingo": []
            }
            ejercicios = Exercise_user.query.filter_by(rutine_id = rutina.id).all()
            for ejercicio in ejercicios:
                if (ejercicio.day == 0):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Lunes'].append(ejercicio_day_data)
                if (ejercicio.day == 1):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Martes'].append(ejercicio_day_data)
                if (ejercicio.day == 2):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Miercoles'].append(ejercicio_day_data)
                if (ejercicio.day == 3):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Jueves'].append(ejercicio_day_data)
                if (ejercicio.day == 4):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Viernes'].append(ejercicio_day_data)
                if (ejercicio.day == 5):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Sabado'].append(ejercicio_day_data)
                if (ejercicio.day == 6):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Domingo'].append(ejercicio_day_data)

            rutinas_data.append(rutina_data)
        return jsonify(rutinas_data)
    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/rutines/filter/<filtro>')
def get_rutines_category(filtro):
    try:
        if (filtro == "nombre1"):
            rutinas = Rutine.query.order_by(Rutine.name).all()
        if (filtro == "usuario1"):
            rutinas = Rutine.query.order_by(Rutine.user_id).all()
        if (filtro == "fecha1"):
            rutinas = Rutine.query.order_by(Rutine.created_at).all()
        if (filtro == "nombre2"):
            rutinas = Rutine.query.order_by(Rutine.name.desc()).all()
        if (filtro == "usuario2"):
            rutinas = Rutine.query.order_by(Rutine.user_id.desc()).all()
        if (filtro == "fecha2"):
            rutinas = Rutine.query.order_by(Rutine.created_at.desc()).all()
        
        rutinas_data = []
        for rutina in rutinas:
            user = User.query.filter_by(id = rutina.user_id).first()
            rutina_data = {
                "id": rutina.id,
                "description": rutina.description, 
                "name_rutine": rutina.name,
                "name": user.nickname,
                "date": rutina.created_at.strftime("%x"),
                "Lunes": [],
                "Martes": [],
                "Miercoles": [],
                "Jueves": [],
                "Viernes": [],
                "Sabado": [],
                "Domingo": []
            }
            ejercicios = Exercise_user.query.filter_by(rutine_id = rutina.id).all()
            for ejercicio in ejercicios:
                if (ejercicio.day == 0):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Lunes'].append(ejercicio_day_data)
                if (ejercicio.day == 1):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Martes'].append(ejercicio_day_data)
                if (ejercicio.day == 2):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Miercoles'].append(ejercicio_day_data)
                if (ejercicio.day == 3):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Jueves'].append(ejercicio_day_data)
                if (ejercicio.day == 4):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Viernes'].append(ejercicio_day_data)
                if (ejercicio.day == 5):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Sabado'].append(ejercicio_day_data)
                if (ejercicio.day == 6):
                    base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                    ejercicio_day_data = {
                        "exercise": base_ejercicio.name
                    }
                    rutina_data['Domingo'].append(ejercicio_day_data)

            rutinas_data.append(rutina_data)
        return jsonify(rutinas_data)
    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/rutine/<id>')
def get_rutine_id (id):
    try:
        rutina = Rutine.query.filter_by(id=id).first()
        user = User.query.filter_by(id = rutina.user_id).first()
        rutina_data = {
            "id": rutina.id,
            "description": rutina.description, 
            "name_rutine": rutina.name,
            "name": user.nickname,
            "date": rutina.created_at.strftime("%x"),
            "lunes": [],
            "martes": [],
            "miercoles": [],
            "jueves": [],
            "viernes": [],
            "sabado": [],
            "domingo": []
        }
        ejercicios = Exercise_user.query.filter_by(rutine_id = rutina.id).all()
        for ejercicio in ejercicios:
            if (ejercicio.day == 0):
                base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                ejercicio_day_data = {
                    "exercise": base_ejercicio.name,
                    "img1": base_ejercicio.img1,
                    "img2": base_ejercicio.img2,
                    "peso": ejercicio.weight,
                    "sets": ejercicio.sets,
                    "reps": ejercicio.repetition,
                    "rest": ejercicio.rest
                }
                rutina_data['lunes'].append(ejercicio_day_data)
            if (ejercicio.day == 1):
                base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                ejercicio_day_data = {
                    "exercise": base_ejercicio.name,
                    "img1": base_ejercicio.img1,
                    "img2": base_ejercicio.img2,
                    "peso": ejercicio.weight,
                    "sets": ejercicio.sets,
                    "reps": ejercicio.repetition,
                    "rest": ejercicio.rest
                }
                rutina_data['martes'].append(ejercicio_day_data)
            if (ejercicio.day == 2):
                base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                ejercicio_day_data = {
                    "exercise": base_ejercicio.name,
                    "img1": base_ejercicio.img1,
                    "img2": base_ejercicio.img2,
                    "peso": ejercicio.weight,
                    "sets": ejercicio.sets,
                    "reps": ejercicio.repetition,
                    "rest": ejercicio.rest
                }
                rutina_data['miercoles'].append(ejercicio_day_data)
            if (ejercicio.day == 3):
                base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                ejercicio_day_data = {
                    "exercise": base_ejercicio.name,
                    "img1": base_ejercicio.img1,
                    "img2": base_ejercicio.img2,
                    "peso": ejercicio.weight,
                    "sets": ejercicio.sets,
                    "reps": ejercicio.repetition,
                    "rest": ejercicio.rest
                }
                rutina_data['jueves'].append(ejercicio_day_data)
            if (ejercicio.day == 4):
                base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                ejercicio_day_data = {
                    "exercise": base_ejercicio.name,
                    "img1": base_ejercicio.img1,
                    "img2": base_ejercicio.img2,
                    "peso": ejercicio.weight,
                    "sets": ejercicio.sets,
                    "reps": ejercicio.repetition,
                    "rest": ejercicio.rest
                }
                rutina_data['viernes'].append(ejercicio_day_data)
            if (ejercicio.day == 5):
                base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                ejercicio_day_data = {
                    "exercise": base_ejercicio.name,
                    "img1": base_ejercicio.img1,
                    "img2": base_ejercicio.img2,
                    "peso": ejercicio.weight,
                    "sets": ejercicio.sets,
                    "reps": ejercicio.repetition,
                    "rest": ejercicio.rest
                }
                rutina_data['sabado'].append(ejercicio_day_data)
            if (ejercicio.day == 6):
                base_ejercicio = Exercise.query.filter_by(id = ejercicio.exercises_id).first()
                ejercicio_day_data = {
                    "exercise": base_ejercicio.name,
                    "img1": base_ejercicio.img1,
                    "img2": base_ejercicio.img2,
                    "peso": ejercicio.weight,
                    "sets": ejercicio.sets,
                    "reps": ejercicio.repetition,
                    "rest": ejercicio.rest
                }
                rutina_data['domingo'].append(ejercicio_day_data)

        return jsonify(rutina_data)
    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/rutines', methods=['POST'])
def create_rutine():
    i = 0
    data = request.json
    info = data.get('listaEjercicios')
    id_user = data.get('id')
    descripcion = data.get('descripcionRutina')
    nombre_rutina = data.get('nombreRutina')
    new_rutine = Rutine(description = descripcion ,name = nombre_rutina, user_id = id_user)
    db.session.add(new_rutine)
    db.session.commit()
    for day in info:
        dia = info.get(day)
        if (dia[0] != -1):
            for ejercicio in dia:
                id = ejercicio.get('id')
                nombre = ejercicio.get('nombre')
                peso = ejercicio.get('peso')
                series = ejercicio.get('series')
                repeticiones = ejercicio.get('repeticiones')
                descanso = ejercicio.get('descanso')
                new_exercise_user = Exercise_user(rest = descanso, user_id = id_user, sets=series, weight=peso, repetition=repeticiones, day=i, exercises_id=id, rutine_id=new_rutine.id)
                db.session.add(new_exercise_user)
                db.session.commit()
        i = i + 1
    return jsonify({
            "success": True, 
            }), 201

@app.route('/user_exercises')
def get_exercises_by_user():
    try:
        exercises = Exercise_user.query.all()
        exercises_data = []
        for exercise in exercises:
            ejercicio = Exercise.query.filter_by(id = exercise.exercises_id).first()
            dia = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"]                
            exercise_data = {
                "id": exercise.id,
                "user_id": exercise.user_id, 
                "name": ejercicio.name,
                "img1": ejercicio.img1,
                "img2": ejercicio.img2,
                "weight": exercise.weight,
                "sets": exercise.sets,
                "repetition": exercise.repetition,
                "day": dia[exercise.days],
                "rutine_id": exercise.rutine_id
            }
            exercises_data.append(exercise_data)
        return jsonify(exercises_data)
    except Exception as error:
        print('Error', error)
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/active_rutine', methods=['PUT'])
def change_active_rutine_by_user():
    data = request.json
    id_user = data.get('id_usuario')
    rutine_id = data.get('id_rutina')

    user = User.query.filter_by(id = id_user).first()

    if (user):
        user.active_rutine_id = rutine_id
        db.session.commit()
        return jsonify({ "success": True }), 200
    
    else:
        return jsonify({ "success": False, "message": "Usuario no encontrado" }), 404

if __name__ == '__main__':
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(port=5000, debug=True)