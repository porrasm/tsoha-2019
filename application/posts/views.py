from application import app, db
from flask import redirect, render_template, request, url_for
from application.posts.models import Post, post_schema, posts_schema
from flask import jsonify
from flask_marshmallow import Marshmallow

@app.route("/posts", methods=["GET"])
def posts_index():

    all = Post.query.all()

    print("query length: ", len(all))

    posts = posts_schema.dump(Post.query.all()).data

    print("returning posts ", len(posts))

    return jsonify(posts)

@app.route("/posts/new/")
def posts_form():
    return render_template("posts/new.html")

@app.route("/posts/", methods=["POST"])
def posts_create():
    print("Trying to create post...")
    print(request.form.get("title"))
  
    post = Post(request.form.get("title"), request.form.get("text"), 0, 0)

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