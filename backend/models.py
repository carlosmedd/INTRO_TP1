import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    nickname = db.Column(db.String(255), nullable=False)
    active_rutine_id = db.Column(db.Integer, db.ForeignKey('rutinas.id'))

class Rutine(db.Model):
    __tablename__ = 'rutinas'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id')) 
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())

class Exercise_user(db.Model):
    __tablename__ = 'ejercicios_usuario'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    exercises_id = db.Column(db.Integer, db.ForeignKey('ejercicios.id'))
    weight = db.Column(db.Integer, nullable=False, default=0)
    sets = db.Column(db.Integer, nullable=False, default=0)
    repetition = db.Column(db.Integer, nullable=False, default=0)
    day = db.Column(db.Integer, nullable=False)
    rest = db.Column(db.Integer, nullable=False)
    rutine_id = db.Column(db.Integer, db.ForeignKey('rutinas.id'))

class Exercise(db.Model):
    __tablename__ = 'ejercicios'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    muscle = db.Column(db.String(255), nullable=False)
    img1 = db.Column(db.String(255), nullable=False)
    img2 = db.Column(db.String(255), nullable=False)

class Comment(db.Model):
    __tablename__ = 'comentarios'
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(500), nullable=False)
    created = db.Column(db.DateTime, default=datetime.datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    responses = db.relationship("Response")

class Response(db.Model):
    __tablename__ = 'respuestas'
    id = db.Column(db.Integer, primary_key=True)
    response = db.Column(db.String(500), nullable=False)
    created = db.Column(db.DateTime, default=datetime.datetime.now())
    comment_id = db.Column(db.Integer, db.ForeignKey('comentarios.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))