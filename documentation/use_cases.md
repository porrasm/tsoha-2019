# ReadIt Forum
[Main page](https://github.com/porrasm/tsoha-2019)

[ReadIt Forum on Heroku](https://readit-forum.herokuapp.com/)

[Database structure](https://github.com/porrasm/tsoha-2019/blob/master/documentation/database.md)

## Use cases

### Viewing posts & users

The user can view all the posts without signing in. He however cannot like, dislike or comment on the posts.

All posts can be viewed on the home page. 

```sql
Query for all posts:
Endpoint: GET /api/posts

SELECT * FROM Post
```

The user can also view posts by a certain user.

```sql
Query for all posts by user:
Endpoint: GET /api/posts/by/user_id

SELECT * FROM Post WHERE Post.user_id = {user_id}
```

Currently the user can view a single post but this isn't done in a single query.
```sql
Queries for a single post:
Endpoint: GET /api/posts/post_id

Post:           SELECT * FROM Post WHERE Post.id = {post_id}
Post user:      SELECT * FROM User WHERE User.id = {previous_post.user_id}

Post comments:  SELECT Comment.id, Comment.text, Comment.upvotes, Comment.downvotes,
                Comment.date_created, Comment.edited, Comment.comment_id, 
                Account.id, Account.username 
                FROM Comment LEFT JOIN Account ON
                Comment.user_id = Account.id
                WHERE Comment.post_id = {post.id}
```

When in the user page, the page will show all the posts by the user. On top of this it shows statistics about the user.

```sql
Query for getting user information
Endpoint: GET /api/account/user_id

User:               SELECT * FROM Account WHERE Account.id = {user_id}

Post amount:        SELECT COUNT(*) FROM Post WHERE Post.user_id = {user_id}

Post like ratio:    SELECT CAST((SELECT SUM(upvotes) 
                    FROM Post WHERE Post.user_id = {user_id}) AS FLOAT) 
                    / 
                    CAST(((SELECT SUM(upvotes) FROM Post WHERE Post.user_id = {user_id}) + 
                    (SELECT SUM(downvotes) FROM Post 
                    WHERE Post.user_id = {user_id})) AS FLOAT)

Comment amount:     SELECT COUNT(*) FROM Comment WHERE Comment.user_id = {user_id}

Comment like ratio: SELECT CAST((SELECT SUM(upvotes) 
                    FROM Comment WHERE Comment.user_id = {user_id}) AS FLOAT) 
                    / 
                    CAST(((SELECT SUM(upvotes) FROM Comment 
                    WHERE Comment.user_id = {user_id}) + 
                    (SELECT SUM(downvotes) FROM Comment 
                    WHERE Comment.user_id = {user_id})) AS FLOAT)
```

### Registering & Signing in

If the user wants to acces more of the features he can register or sign in to an existing account.

```sql
Query for registering:
Endpoint: POST /api/register

INSERT INTO Account(username, password) VALUES('{username}', '{password}')
```

```sql
Query for signing in:
Endpoint: POST /api/login

SELECT FIRST (*) FROM Account WHERE Account.username = '{username}'
```

### Signed in functionality

When the user has signed in he can create posts, upvote posts and comments and delete his or her posts, comments and account.

#### Creating
```sql
Query for creating posts:
Endpoint: POST /api/posts/create

INSERT INTO Post(title, text, upvotes, downvotes) 
VALUES('{post_title}', '{post_text}', 0, 0)
```
```sql
Query for creating comments:
Endpoint: POST /api/posts/comments/post_id/comment_id

INSERT INTO Comment(text, upvotes, downvotes) 
VALUES('{comment_text}', 0, 0)
```
#### Voting
When liking/disliking posts or comments the previous vote (if it exists) is removed. If the user likes or dislikes something again their vote is removed entirely.
```sql
Query for voting posts:
Endpoint: GET /api/posts/(dis)like

Deleting vote:      DELETE FROM Post_Vote WHERE Post_Vote.user_id = {user_id} 
                    AND Post_Vote.post_id = {post_id}

Creating vote:      INSERT INTO Post_Vote (post_id, user_id, like)
                    VALUES ('{post_id}', '{user_id}', {like})
```
```sql
Query for voting comments:
Endpoint: GET /api/posts/comments/(dis)like

Deleting vote:      DELETE FROM Comment_Vote WHERE Comment_Vote.user_id = {user_id} 
                    AND Comment_Vote.comment_id = {comment_id}

Creating vote:      INSERT INTO Comment_Vote (comment_id, user_id, like)
                    VALUES ('{comment_id}', '{user_id}', {like})
```
#### Deleting

The user can delete his or her posts, comments and account.

```sql
Query for deleting posts:
Endpoint: DELETE /api/posts/post_id

DELETE FROM Post WHERE Post.id = {post_id}
```

```sql
Query for deleting comments:
Endpoint: DELETE /api/posts/comment/comment_id

DELETE FROM Comment WHERE Comment.id = {comment_id}
```

```sql
Query for deleting user:
Endpoint: DELETE /api/account

DELETE FROM Account WHERE Account.id = {user_id}
```

### Top users list

There is a page dedicated for the top users on the forum. This page has two top ten lists: Most posts by user in 1 week and highest rated users.

```sql
Query for 10 most active users:
Endpoint: GET /api/users/active

SELECT Account.username, Account.id, COUNT(*) as post_count
FROM Account LEFT JOIN Post ON Account.id = Post.user_id
AND Post.date_created <= DATE('now', '-7 day')
GROUP BY Account.username ORDER BY post_count DESC LIMIT 10
```
```sql
Query for 10 highest reated users:
Endpoint: GET /api/users/active

SELECT Account.username, Account.id, 

(WCAST((
    COALESCE(SUM(distinct Post.upvotes),0) + 
    COALESCE(SUM(distinct Comment.upvotes),0)) AS FLOAT) / 
CAST((
    COALESCE(SUM(distinct Post.upvotes),0) + 
    COALESCE(SUM(distinct Post.downvotes),0) + 
    COALESCE(SUM(distinct Comment.upvotes),0) + 
    COALESCE(SUM(distinct Comment.downvotes),0)) AS FLOAT)) as like_ratio

FROM Account LEFT JOIN Post ON Account.id = Post.user_id
LEFT JOIN Comment ON Account.id = Comment.user_id
GROUP BY Account.username ORDER BY like_ratio DESC LIMIT 10
```

### For database structure and schema see [database structure](https://github.com/porrasm/tsoha-2019/blob/master/documentation/database.md)