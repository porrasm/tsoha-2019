# ReadIt Forum
[Main page](https://github.com/porrasm/tsoha-2019)

[ReadIt Forum on Heroku](https://readit-forum.herokuapp.com/)

# Database structure

Original database structure draft:

![Database schema idea](https://github.com/porrasm/tsoha-2019/blob/master/documentation/database_schema_idea.png)


Current database schema:

![Current database schema](https://github.com/porrasm/tsoha-2019/blob/master/documentation/database_schema.png)

Users will have a username and they can have many posts. Comments have a related post and a user. In the future the comments will most likely have a response comment as well.

Database schema in text:
```
CREATE TABLE account (
        id INTEGER NOT NULL,
        date_created DATETIME,
        date_modified DATETIME,
        username VARCHAR(32) NOT NULL,
        password VARCHAR(32) NOT NULL,
        is_admin BOOLEAN NOT NULL,
        PRIMARY KEY (id),
        CHECK (is_admin IN (0, 1))
);
CREATE TABLE post (
        id INTEGER NOT NULL,
        title VARCHAR(256) NOT NULL,
        text VARCHAR(4096) NOT NULL,
        upvotes INTEGER NOT NULL,
        downvotes INTEGER NOT NULL,
        date_created DATETIME,
        user_id INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY(user_id) REFERENCES account (id)
);
CREATE TABLE comment (
        id INTEGER NOT NULL,
        text VARCHAR(2048) NOT NULL,
        upvotes INTEGER NOT NULL,
        downvotes INTEGER NOT NULL,
        date_created DATETIME,
        edited BOOLEAN NOT NULL,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        comment_id INTEGER,
        PRIMARY KEY (id),
        CHECK (edited IN (0, 1)),
        FOREIGN KEY(user_id) REFERENCES account (id),
        FOREIGN KEY(post_id) REFERENCES post (id),
        FOREIGN KEY(comment_id) REFERENCES comment (id)
);
CREATE TABLE post_vote (
        id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        "like" BOOLEAN NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY(post_id) REFERENCES post (id),
        FOREIGN KEY(user_id) REFERENCES account (id),
        CHECK ("like" IN (0, 1))
);
CREATE TABLE comment_vote (
        id INTEGER NOT NULL,
        comment_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        "like" BOOLEAN NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY(comment_id) REFERENCES comment (id),
        FOREIGN KEY(user_id) REFERENCES account (id),
        CHECK ("like" IN (0, 1))
);
```