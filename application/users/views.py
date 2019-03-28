from application import app, db
from flask import redirect, render_template, request, url_for
from application.users.models import User, user_schema, users_schema
from flask import jsonify
from flask_marshmallow import Marshmallow


@app.route("/login", methods=["POST"])
def user_login(): 
    content = request.get_json(silent=True)

    print("Trying to login: ", content["username"])
  
    user = User.query.filter_by(username=content["username"], password=content["password"]).first()

    if not user:
        return jsonify(None)

    return jsonify(user_schema.dump(user).data)