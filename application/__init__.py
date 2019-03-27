from flask import Flask
from flask_marshmallow import Marshmallow

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")

from flask_sqlalchemy import SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_ECHO"] = True

db = SQLAlchemy(app)
ma = Marshmallow(app)

from application import views

from application.posts import models
from application.posts import views
  
db.create_all()