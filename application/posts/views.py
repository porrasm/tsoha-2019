from application import app, db
from flask import redirect, render_template, request, url_for
from application.posts.models import Post, post_schema, posts_schema, Comment, comment_schema, comments_schema
from application.users.models import User, user_schema, users_schema
from flask import jsonify
from flask_marshmallow import Marshmallow
from flask_jwt_extended import (jwt_required, get_jwt_identity)

route = "/api/posts"

# All posts
@app.route(f"{route}", methods=["GET"])
def posts_index():

    all = Post.query.all()

    print("query length: ", len(all))

    posts = posts_schema.dump(Post.query.all()).data

    print("returning posts ", len(posts))

    return jsonify(posts)

# Single pos
@app.route(f"{route}/get/<post_id>/", methods=["GET"])
def posts_get(post_id):

    post = Post.query.get(post_id)
    post_user = User.query.get(post.user_id)
    post_comments = Comment.query.filter_by(post_id=post.id)

    print("\npost: ", post)
    print("post comments: ", post.comments)

    postDump = post_schema.dump(post).data
    postDump["user"] = user_schema.dump(post_user).data
    postDump["comments"] = comments_schema.dump(post_comments).data

    print("Returning post: ", postDump["title"])

    return jsonify(postDump)

@app.route(f"{route}/create", methods=["POST"])
@jwt_required
def posts_create(): 

    content = request.get_json(silent=True)
    print("\nTrying to create post: ", content["title"])

    current_user = get_jwt_identity()

    print("Current user: ", current_user)

    user_id = current_user["id"]
    print("Current user id: ", user_id)

    post_title = content["title"].strip()
    post_text = content["text"]

    if not post_title or not post_text:
        return jsonify({"error": "Post title and text must not be empty."}), 401

    if len(post_title) < 3 or len(post_title) > 256:
        return jsonify({"error": "Post title must be 3 or more characters and less than or equal to 256 characters."}), 401

    if len(post_text.stip()) < 1 or len(post_text) > 4096:
        return jsonify({"error": "Post text must be 1 or more characters and less than or equal to 4096 characters."}), 401

    post = Post(post_title, post_text, 0, 0)

    post.user_id = user_id

    print("Set post user id")

    db.session().add(post)
    db.session().commit()

    return render_template("index.html")

@app.route(f"{route}/like/<post_id>", methods=["POST"])
@jwt_required
def posts_like(post_id):

    post = Post.query.get(post_id)
    post.downvotes += 1
    db.session().commit()
  
    return jsonify(True)

@app.route(f"{route}/dislike/<post_id>", methods=["POST"])
@jwt_required
def posts_dislike(post_id, comment_id):

    content = request.get_json(silent=True)
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"error": "Error creating comment, user token was invalid"}), 401

    print("content: ", content)

    comment = Comment("test")

    comment.user_id = current_user.id
    comment.post_id = post_id

    if comment_id != -1:
        comment.comment_id = comment_id

    db.session().add(comment)
    db.session().commit()
  
    return jsonify({"message": "Succesfully created comment."}), 201

@app.route(f"{route}/comment/<post_id>/<comment_id>", methods=["POST"])
# @app.route("/api/posts/comment/<post_id>/<comment_id>/", methods=["POST"])
@jwt_required
def create_comment(post_id, comment_id):

    print("\nTrying to create comment...")

    content = request.get_json(silent=True)
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"error": "Error creating comment, user token was invalid"}), 401

    print("content: ", content)

    comment_text = content["comment"]

    if not comment_text:
        return jsonify({"error": "Comment text must not be empty."}), 400

    if len(comment_text) == 0 or len(comment_text) > 2048:
        return jsonify({"error": "Comment text must be between 1-2048 characters"}), 400

    comment = Comment(comment_text, 0, 0)

    comment.user_id = int(current_user["id"])
    comment.post_id = int(post_id)

    if int(comment_id) != -1:
        comment.comment_id = comment_id

    db.session().add(comment)
    db.session().commit()
  
    return jsonify(comment_schema.dump(comment).data), 201