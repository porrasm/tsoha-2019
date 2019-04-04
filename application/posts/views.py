from application import app, db
from flask import redirect, render_template, request, url_for
from application.posts.models import Post, post_schema, posts_schema
from flask import jsonify
from flask_marshmallow import Marshmallow
from flask_jwt_extended import (jwt_required)

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

    post = post_schema.dump(Post.query.get(post_id)).data

    print("Returning post: ", post["title"])

    return jsonify(post)

@app.route(f"{route}/create", methods=["POST"])
@jwt_required
def posts_create(): 
    content = request.get_json(silent=True)

    print("Trying to create post: ", content["title"])
  
    post = Post(content["title"], content["text"], 0, 0)

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