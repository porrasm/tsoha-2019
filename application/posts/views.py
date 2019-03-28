from application import app, db
from flask import redirect, render_template, request, url_for
from application.posts.models import Post, post_schema, posts_schema
from flask import jsonify
from flask_marshmallow import Marshmallow

# All posts
@app.route("/posts", methods=["GET"])
def posts_index():

    all = Post.query.all()

    print("query length: ", len(all))

    posts = posts_schema.dump(Post.query.all()).data

    print("returning posts ", len(posts))

    return jsonify(posts)

# Single pos
@app.route("/posts/<post_id>/", methods=["GET"])
def posts_get(post_id):

    post = post_schema.dump(Post.query.get(post_id)).data

    print("Returning post: ", post.title)

    return jsonify(post)

@app.route("/posts/new/", methods=["GET"])
def posts_form():
    return render_template("posts/new.html")

@app.route("/posts", methods=["POST"])
def posts_create(): 
    content = request.get_json(silent=True)

    print("Trying to create post: ", content["title"])
  
    post = Post(content["title"], content["text"], 0, 0)

    db.session().add(post)
    db.session().commit()

    return redirect(url_for("posts_index"))

@app.route("/posts/like/<post_id>/", methods=["POST"])
def posts_like(post_id):

    post = Post.query.get(post_id)
    post.upvotes += 1
    db.session().commit()
  
    return redirect(url_for("posts_index"))

@app.route("/posts/dislike/<post_id>/", methods=["POST"])
def posts_dislike(post_id):

    post = Post.query.get(post_id)
    post.downvotes += 1
    db.session().commit()
  
    return redirect(url_for("posts_index"))