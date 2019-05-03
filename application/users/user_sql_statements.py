import os
from sqlalchemy.sql import text

production = os.environ.get("HEROKU")

# User functions
def delete_user_stmt(user_id):
    return text(f"DELETE FROM Account WHERE Account.id = :user_id").params(user_id=user_id)

# User statistics
def post_amount_stmt(user_id):
    return text(f"""SELECT COUNT(*) FROM Post WHERE Post.user_id = :user_id""").params(user_id=user_id)

def post_like_ratio_stmt(user_id):

    # Likes / Likes + Dislikes
    return text(f"""SELECT 
    CAST((SELECT SUM(upvotes) FROM Post WHERE Post.user_id = :user_id) AS FLOAT) 
    / 
    CAST(((SELECT SUM(upvotes) FROM Post WHERE Post.user_id = :user_id) + (SELECT SUM(downvotes) FROM Post WHERE Post.user_id = :user_id)) AS FLOAT)""").params(user_id=user_id)

def comment_amount_stmt(user_id):
    return text(f"""SELECT COUNT(*) FROM Comment WHERE Comment.user_id = :user_id""").params(user_id=user_id)

def comment_like_ratio_stmt(user_id):

    # Likes / Likes + Dislikes
    return text(f"""SELECT 
    CAST((SELECT SUM(upvotes) FROM Comment WHERE Comment.user_id = :user_id) AS FLOAT) 
    / 
    CAST(((SELECT SUM(upvotes) FROM Comment WHERE Comment.user_id = :user_id) + (SELECT SUM(downvotes) FROM Comment WHERE Comment.user_id = :user_id)) AS FLOAT)""").params(user_id=user_id)


# Top users
def most_active_users_stmt():

    if production:
        return text(f"""SELECT Account.username, Account.id, COUNT(*) as post_count
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    AND Post.date_created <= now() - interval '7 day'
                    GROUP BY Account.username, Account.id ORDER BY post_count DESC LIMIT 10""")
    else:
        return text(f"""SELECT Account.username, Account.id, COUNT(*) as post_count
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    AND Post.date_created <= DATE('now', '-7 day')
                    GROUP BY Account.username ORDER BY post_count DESC LIMIT 10""")

def highest_rated_users_stmt():

    if production:
        return text(f"""SELECT Account.username, Account.id, 
                    (CAST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0)) AS FLOAT) / 
                    CAST(GREATEST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Post.downvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0) + COALESCE(SUM(distinct Comment.downvotes),0)), 1) AS FLOAT)) as like_ratio
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    LEFT JOIN Comment ON Account.id = Comment.user_id
                    GROUP BY Account.username, Account.id ORDER BY like_ratio DESC LIMIT 10""")

    else:
        return text(f"""SELECT Account.username, Account.id, 
                    (CAST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0)) AS FLOAT) / 
                    CAST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Post.downvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0) + COALESCE(SUM(distinct Comment.downvotes),0)) AS FLOAT)) as like_ratio
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    LEFT JOIN Comment ON Account.id = Comment.user_id
                    GROUP BY Account.username ORDER BY like_ratio DESC LIMIT 10""")
    