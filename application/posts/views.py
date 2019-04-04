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

    post = Post(content["title"], content["text"], 0, 0)

    post.user_id = user_id

    print("Set post user id")

    db.session().add(post)
    db.session().commit()

    return render_template("index.html")

@app.route(f"{route}/comment/<post_id>/<comment_id>/", methods=["POST"])
@jwt_required
def posts_like(post_id, comment_id):

    post = Post.query.get(post_id)
    post.downvotes += 1
    db.session().commit()
  
    return jsonify(True)

@app.route(f"{route}/comment/<post_id>/<comment_id>/", methods=["POST"])
@jwt_required
def posts_dislike(post_id, comment_id):

    post = Post.query.get(post_id)
    post.downvotes += 1
    db.session().commit()
  
    return jsonify(True)