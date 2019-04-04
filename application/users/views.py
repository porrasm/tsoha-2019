from application import app, db
from flask import redirect, render_template, request, url_for
from application.users.models import User, authenticate, user_schema, users_schema
from flask import jsonify
from flask_marshmallow import Marshmallow
from flask_jwt_extended import create_access_token, create_refresh_token

@app.route("/api/login", methods=["POST"])
def user_login(): 
    content = request.get_json(silent=True)

    print("\nTrying to login: ", content["username"])
  
    database_user = authenticate(username=content["username"], password=content["password"])

    if not database_user:
        # SEND HTTP CODE 401
        return jsonify(None)

    return get_authenticated_user(database_user)

@app.route("/api/register", methods=["POST"])
def user_register(): 
    content = request.get_json(silent=True)

    print("\nTrying to create user: ", content["username"])
  
    database_user = User.query.filter_by(username=content["username"]).first()

    if database_user:
        return jsonify({"error": "This username has been taken"}), 409

    user_username = content["username"]
    user_password = content["password"]

    if not user_username or not user_password:
        return jsonify({"error": "Username and password must not be empty."}), 401

    if " " in user_username or not user_username.isalnum():
        return jsonify({"error": "Username must be alphanumeric without whitespace."}), 401
    
    if len(user_username) < 5 or len(user_username) > 32:
        return jsonify({"error": "Username must be between 5 and 32 characters"}), 401

    if len(user_password) < 5 or len(user_password) > 32:
        return jsonify({"error": "Password must be between 5 and 32 characters"}), 401

    new_user = User(user_username, user_password)

    print("Creating user: ", new_user)

    db.session().add(new_user)
    db.session().commit()

    return get_authenticated_user(new_user), 201

def get_authenticated_user(database_user):
    
    print("Dumping data to user")
    user = user_schema.dump(database_user).data
    del user["password"]

    print("User found: ", user)

    access_token = create_access_token(identity=user)
    refresh_token = create_refresh_token(identity=user)

    print("Created tokens")

    response = {"user": user, "access_token": access_token, "refresh_token": refresh_token}

    print("Returning response: ", response)
    return jsonify(response)