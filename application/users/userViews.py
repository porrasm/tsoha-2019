from application import app, db
from flask import redirect, render_template, request, url_for
from application.users.userModels import User, authenticate, user_schema, users_schema
from application.posts.postModels import Post
from flask import jsonify
from flask_marshmallow import Marshmallow
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import (jwt_required, get_jwt_identity)
from sqlalchemy.sql import text
import application.users.user_sql_statements as stmts

@app.route("/api/login", methods=["POST"])
def user_login(): 
    content = request.get_json(silent=True)

    print("\nTrying to login: ", content["username"])
  
    database_user = authenticate(username=content["username"], password=content["password"])

    if not database_user:
        # SEND HTTP CODE 401
        return jsonify({"error": "Incorrect username or password"}), 401

    return get_authenticated_user(database_user, False)

@app.route("/api/register", methods=["POST"])
def user_register(): 
    content = request.get_json(silent=True)

    print("\nTrying to create user: ", content["username"])
  
    database_user = User.get_user_by_username(content["username"])

    if database_user:
        return jsonify({"error": "This username has been taken"}), 409

    user_username = content["username"]
    user_password = content["password"]

    name_error = get_username_error(user_username)
    password_error = get_password_error(user_password)

    if name_error:
        return jsonify({"error": name_error}), 401
    if password_error:
        return jsonify({"error": password_error}), 401


    new_user = User(user_username, user_password)

    print("Creating user: ", new_user)

    db.session().add(new_user)
    db.session().commit()

    return get_authenticated_user(new_user, False), 201

@app.route("/api/users/active", methods=["GET"])
def most_active_users(): 

    print("\nReturning most active users: ")
  
    users = User.most_active_users()

    print(users)

    return jsonify(users)

@app.route("/api/users/rated", methods=["GET"])
def highest_rated_users(): 

    print("\nReturning highest rated users: ")
  
    users = User.highest_rated_users()

    print(users)

    return jsonify(users)


@app.route("/api/update/<user_id>", methods=["PUT"])
@jwt_required
def update_user(user_id):

    print("\nTrying to update id: ", user_id)

    updated_user = request.get_json(silent=True)

    database_user = User.get_user_by_id(updated_user["id"])

    if database_user.username == "admin":
        return jsonify({"error": "Admin accounts can only be changed by the site owner."}), 409

    if not database_user:
        return jsonify({"error": "Could not find user. It might have been deleted from the database."}), 404 
    
    if not database_user.password_equals(updated_user["password"]):
        return jsonify({"error": "Incorrect password."}), 401

    existing_user = User.get_user_by_username(updated_user["username"])

    if existing_user:
        return jsonify({"error": "This username has been taken"}), 409


    # Username check and validation
    if database_user.username != updated_user["username"]:

        name_error = get_username_error(updated_user["username"])
        if name_error:
            return jsonify({"message": name_error}), 401

        database_user.username = updated_user["username"]
    
    # Password check and validation
    if database_user.password != updated_user["password"]:

        password_error = get_password_error(updated_user["password"])
        if password_error:
            return jsonify({"message": password_error}), 401

        database_user.password = updated_user["password"]
    
    print("Succesfully updated account")

    authenticated_user = get_authenticated_user(database_user, True)

    print("Committing to database")
    db.session().commit()
    print("Commit succesful")

    print("\nReturning response")
    return jsonify({"message": "Succesfully updated account", "user": authenticated_user}), 201

@app.route("/api/account", methods=["DELETE"])
@jwt_required
def delete_user():

    identity = get_jwt_identity()

    if identity["username"] == "admin":
        return jsonify({"error": "Admin accounts cannot be deleted"}), 401

    id = identity["id"]

    # Delete comments by user
    stmt = text(f"DELETE FROM Comment WHERE Comment.user_id = {id}")
    response = db.engine.execute(stmt)
 
    # Delete comments in posts by user
    posts = Post.query.filter_by(user_id=id)

    for post in posts:
        stmt = text(f"DELETE FROM Comment WHERE Comment.post_id = {post.id}")
        response = db.engine.execute(stmt)

        stmt = text(f"DELETE FROM Post_Vote WHERE Post_Vote.post_id = {post.id}")
        response = db.engine.execute(stmt)
        
    # Delete posts by user
    stmt = text(f"DELETE FROM Post WHERE Post.user_id = {id}")
    response = db.engine.execute(stmt)

    # Delete user
    stmt = stmts.delete_user_stmt(id)
    response = db.engine.execute(stmt)

    return jsonify({"message": "Succesfully deleted account"}), 200

@app.route("/api/account/<user_id>", methods=["GET"])
@jwt_required
def get_user_info(user_id):

    print("\nGetting user info: ", user_id)

    database_user = User.get_user_by_id(user_id)

    if not database_user:
        return jsonify({"error": "This account is not found"}), 404

    response = {}

    response["_username"] = database_user.username
    response["_id"] = database_user.id

    response["post_amount"] = database_user.post_amount()
    response["post_like_ratio"] = database_user.post_like_ratio()

    response["comment_amount"] = database_user.comment_amount()
    response["comment_like_ratio"] = database_user.comment_like_ratio()

    return jsonify(response), 200


def get_authenticated_user(database_user, returnAsObject):
    
    print("\nDumping data to user")
    user = user_schema.dump(database_user).data
    del user["password"]

    print("User found: ", user)

    access_token = create_access_token(identity=user)
    refresh_token = create_refresh_token(identity=user)

    print("Created tokens")

    response = {"user": user, "access_token": access_token, "refresh_token": refresh_token}

    if returnAsObject == True:
        return response
    
    print("Returning response: ", response)
    return jsonify(response)

def get_username_error(username):

    if username == "admin":
        return "This username has been taken"

    if not username:
        return "Username must not be empty."

    if " " in username or not username.isalnum():
        return "Username must be alphanumeric without whitespace."
    
    if len(username) < 5 or len(username) > 32:
        return "Username must be between 5 and 32 characters"

def get_password_error(password):
    if not password:
        return "Password must not be empty."

    if len(password) < 5 or len(password) > 32:
        return "Password must be between 5 and 32 characters"