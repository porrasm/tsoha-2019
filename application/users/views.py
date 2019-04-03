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