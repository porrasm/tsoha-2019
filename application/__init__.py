from flask import Flask
from flask_marshmallow import Marshmallow
from flask_jwt_extended import (JWTManager)
from flask_sqlalchemy import SQLAlchemy
import os


app = Flask(__name__, static_folder="../static/dist", template_folder="../static")

if os.environ.get("HEROKU"):
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"    
    app.config["SQLALCHEMY_ECHO"] = True

app.config['JWT_SECRET_KEY'] = 'placeholder'
jwt = JWTManager(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)

from application import views

from application.posts import models
from application.posts import views

from application.users import models
from application.users import views
  
# Database init
db.create_all()

from application.users.models import User
User.create_admin()