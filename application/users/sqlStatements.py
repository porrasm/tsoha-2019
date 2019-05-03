import os
from sqlalchemy.sql import text

heroku = os.environ.get("HEROKU")

def most_active_users_stmt():

    if heroku:
        return text(f"""SELECT Account.username, Account.id, COUNT(*) as post_count
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    AND Post.date_created <= now() - interval '7 day'
                    GROUP BY Account.username ORDER BY post_count DESC LIMIT 10""")
    else:
        return text(f"""SELECT Account.username, Account.id, COUNT(*) as post_count
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    AND Post.date_created <= DATE('now', '-7 day')
                    GROUP BY Account.username ORDER BY post_count DESC LIMIT 10""")

def highest_rated_users_stmt():

    if heroku:
        return text(f"""SELECT Account.username, Account.id, 
                    (CAST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0)) AS FLOAT) / 
                    CAST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Post.downvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0) + COALESCE(SUM(distinct Comment.downvotes),0)) AS FLOAT)) as like_ratio
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    LEFT JOIN Comment ON Account.id = Comment.user_id
                    GROUP BY Account.username ORDER BY like_ratio DESC LIMIT 10""")

    else:
        return text(f"""SELECT Account.username, Account.id, 
                    (CAST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0)) AS FLOAT) / 
                    CAST((COALESCE(SUM(distinct Post.upvotes),0) + COALESCE(SUM(distinct Post.downvotes),0) + COALESCE(SUM(distinct Comment.upvotes),0) + COALESCE(SUM(distinct Comment.downvotes),0)) AS FLOAT)) as like_ratio
                    FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                    LEFT JOIN Comment ON Account.id = Comment.user_id
                    GROUP BY Account.username ORDER BY like_ratio DESC LIMIT 10""")
    