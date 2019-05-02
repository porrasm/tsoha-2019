# ReadIt Forum
[Main page](https://github.com/porrasm/tsoha-2019)

[ReadIt Forum on Heroku](https://readit-forum.herokuapp.com/)

## Use cases

### Viewing posts & users

The user can view all the posts without signing in. He however cannot like, dislike or comment on the posts.

All posts can be viewed on the home page. 

```
Query for all posts:
End point: GET /api/posts

SELECT * FROM Post
```

The user can also view posts by a certain user.

```
Query for all posts by user:
End point: GET /api/posts/by/user_id

SELECT * FROM Post WHERE Post.user_id = {user_id}
```

Currently the user can view a single post but this isn't done in a single query.
```
Queries for a single post:
End point: GET /api/posts/post_id

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

```
Query for getting user information
End point: GET /api/account/user_id

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

```
Query for registering:
End point: POST /api/register

INSERT INTO Account(username, password) VALUES('{username}', '{password}')
```

```
Query for signing in:
End point: POST /api/login

SELECT FIRST (*) FROM Account WHERE Account.username = '{username}'
```

### Signed in functionality

When the user has signed in he can create posts, upvote posts and comments and delete his or her posts, comments and account.

#### Creating
```
Query for creating posts:
End point: POST /api/posts/create

INSERT INTO Post(title, text, upvotes, downvotes) 
VALUES('{post_title}', '{post_text}', 0, 0)
```
```
Query for creating comments:
End point: POST /api/posts/comments/post_id/comment_id

INSERT INTO Comment(text, upvotes, downvotes) 
VALUES('{comment_text}', 0, 0)
```
#### Voting
When liking/disliking posts or comments the previous vote (if it exists) is removed. If the user likes or dislikes something again their vote is removed entirely.
```
Query for voting posts:
End point: GET /api/posts/(dis)like

Deleting vote:      DELETE FROM Post_Vote WHERE Post_Vote.user_id = {user_id} 
                    AND Post_Vote.post_id = {post_id}

Creating vote:      INSERT INTO Post_Vote (post_id, user_id, like)
                    VALUES ('{post_id}', '{user_id}', {like})
```
```
Query for voting comments:
End point: GET /api/posts/comments/(dis)like

Deleting vote:      DELETE FROM Comment_Vote WHERE Comment_Vote.user_id = {user_id} 
                    AND Comment_Vote.comment_id = {comment_id}

Creating vote:      INSERT INTO Comment_Vote (comment_id, user_id, like)
                    VALUES ('{comment_id}', '{user_id}', {like})
```
#### Deleting

