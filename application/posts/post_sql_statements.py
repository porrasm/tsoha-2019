import os
from sqlalchemy.sql import text

production = os.environ.get("HEROKU")

# Post functions
def posts_by_user_stmt(user_id):
    return text(f"SELECT * FROM Post WHERE Post.user_id={user_id}")

def posts_delete_stmt(post_id):
    return text(f"DELETE FROM Post WHERE Post.id = {post_id}")

def comments_delete_stmt(comment_id):
    return text(f"DELETE FROM Comment WHERE Comment.id = {comment_id}")

def comments_with_authors_stmt(post_id):
        return text(f"""SELECT Comment.id, Comment.text, Comment.upvotes, Comment.downvotes, Comment.date_created, Comment.edited, Comment.comment_id, 
        Account.id, Account.username 
        FROM Comment LEFT JOIN Account ON
        Comment.user_id = Account.id
        WHERE Comment.post_id = {post_id}""")

