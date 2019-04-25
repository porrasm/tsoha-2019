from application import app, db
from flask import redirect, render_template, request, url_for
from application.posts.postModels import Post, post_schema, posts_schema, Comment, comment_schema, comments_schema, PostVote, CommentVote
from application.users.userModels import User, user_schema, users_schema
from flask import jsonify
from flask_marshmallow import Marshmallow
from flask_jwt_extended import (jwt_required, get_jwt_identity)
from sqlalchemy.sql import text

route = "/api/posts"

# All posts
@app.route(f"{route}", methods=["GET"])
def posts_index():

    all = Post.query.all()

    print("query length: ", len(all))

    posts = posts_schema.dump(Post.query.all()).data

    print("returning posts ", len(posts))

    return jsonify(posts)

# Single post
@app.route(f"{route}/<post_id>/", methods=["GET"])
def posts_get(post_id):

    post = Post.query.get(post_id)
    post_user = User.query.get(post.user_id)
    post_comments = Comment.query.filter_by(post_id=post.id)
    post_comments = post.comments_with_authors()

    print("\npost: ", post)
    print("post comments: ", post.comments)

    postDump = post_schema.dump(post).data
    postDump["user"] = user_schema.dump(post_user).data
    postDump["comments"] = post_comments

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

    if len(post_text.strip()) < 1 or len(post_text) > 4096:
        return jsonify({"error": "Post text must be 1 or more characters and less than or equal to 4096 characters."}), 401

    post = Post(post_title, post_text, 0, 0)

    post.user_id = user_id

    print("Set post user id")

    db.session().add(post)
    db.session().commit()

    post_vote(post, current_user, True)

    return render_template("index.html")

# Post deletion
@app.route(f"{route}/<post_id>", methods=["DELETE"])
@jwt_required
def posts_delete(post_id):

    user = get_jwt_identity()
    database_user = User.query.get(user["id"])
    post = Post.query.get(post_id)

    if post.user_id != database_user.id and not database_user.is_admin:
        return jsonify({"error": "You do not have the permission to delete this post."}), 401

    stmt = text(f"DELETE FROM Comment WHERE Comment.post_id = {post.id}")
    response = db.engine.execute(stmt)

    stmt = text(f"DELETE FROM Post_Vote WHERE Post_Vote.post_id = {post.id}")
    response = db.engine.execute(stmt)

    stmt = text(f"DELETE FROM Post WHERE Post.id = {post.id}")
    response = db.engine.execute(stmt)

    # Comment vote deletion

    return jsonify({"message": "Successfully deleted post"})



# Post voting
@app.route(f"{route}/like/<post_id>", methods=["GET"])
@jwt_required
def posts_like(post_id):

    print("\nLiking post: ", post_id)

    post = Post.query.get(post_id)
    current_user = get_jwt_identity()

    return post_vote(post, current_user, True)


@app.route(f"{route}/dislike/<post_id>", methods=["GET"])
@jwt_required
def posts_dislike(post_id):

    post = Post.query.get(post_id)
    current_user = get_jwt_identity()

    return post_vote(post, current_user, False)

def post_vote(post, user, like):

    print("Voting post: ", post.title)
    
    previous_vote = PostVote.get_vote(post.id, user["id"], like)
    opposite_vote = PostVote.get_vote(post.id, user["id"], not like)
    new_vote = PostVote(post.id, user["id"], like)

    amount = 0
    alternate_amount = 0

    if previous_vote:
        amount = -1
        db.session().delete(previous_vote)
    else:
        amount = 1
        db.session().add(new_vote)

    if opposite_vote:
        alternate_amount = -1
        db.session().delete(opposite_vote)

    if like:
        post.upvotes += amount
        post.downvotes += alternate_amount
    else:
        post.downvotes += amount
        post.upvotes += alternate_amount

    db.session().commit()
  
    return jsonify({"like": like, "value": amount, "opposite_value": alternate_amount}), 200

# Comment creating
@app.route(f"{route}/comments/<post_id>/<comment_id>", methods=["POST"])
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

# Comment voting
@app.route(f"{route}/comments/like/<comment_id>", methods=["GET"])
@jwt_required
def comments_like(comment_id):

    print("\nLiking comment: ", comment_id)

    comment = Comment.query.get(comment_id)
    current_user = get_jwt_identity()

    return comment_vote(comment, current_user, True)

@app.route(f"{route}/comments/dislike/<comment_id>", methods=["GET"])
@jwt_required
def comments_dislike(comment_id):

    print("\nDisliking comment: ", comment_id)

    comment = Comment.query.get(comment_id)
    current_user = get_jwt_identity()

    return comment_vote(comment, current_user, False)

def comment_vote(comment, user, like):

    print("Voting comment: ", comment.text)
    
    previous_vote = CommentVote.get_vote(comment.id, user["id"], like)
    opposite_vote = CommentVote.get_vote(comment.id, user["id"], not like)
    new_vote = CommentVote(comment.id, user["id"], like)

    amount = 0
    alternate_amount = 0

    if previous_vote:
        amount = -1
        db.session().delete(previous_vote)
    else:
        amount = 1
        db.session().add(new_vote)

    if opposite_vote:
        alternate_amount = -1
        db.session().delete(opposite_vote)

    if like:
        comment.upvotes += amount
        comment.downvotes += alternate_amount
    else:
        comment.downvotes += amount
        comment.upvotes += alternate_amount

    db.session().commit()
  
    return jsonify({"like": like, "value": amount, "opposite_value": alternate_amount}), 200
