from application import db, ma
from sqlalchemy.sql import text

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(256), nullable=False)
    text = db.Column(db.String(4096), nullable=False)

    upvotes = db.Column(db.Integer, nullable=False)
    downvotes = db.Column(db.Integer, nullable=False)

    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    user_id = db.Column(db.Integer, db.ForeignKey('account.id'),
                           nullable=False)
    
    comments = db.relationship("Comment", backref='post', lazy=True)
    

    def __init__(self, title, text, upvotes, downvotes):
        self.title = title
        self.text = text
        self.upvotes = upvotes
        self.downvotes = downvotes

    def comments_with_authors(self):

        def row_to_comment(row):
            comment = {
                "id": row[0],
                "text": row[1],
                "upvotes": row[2],
                "downvotes": row[3],
                "date_created": row[4],
                "response_id": row[5],
                "user_id": row[6],
                "user_username": row[7]
            }

            print("RETURNING COMMENT OBJECT: ", comment)

            return comment

        stmt = text(f"""SELECT Comment.id, Comment.text, Comment.upvotes, Comment.downvotes, Comment.date_created, Comment.comment_id, 
        Account.id, Account.username 
        FROM Comment LEFT JOIN Account ON
        Comment.user_id = Account.id
        WHERE Comment.post_id = {self.id}""")

        response = db.engine.execute(stmt)

        comments = []

        for row in response:
            print("\n ROW: ", row)
            comments.append(row_to_comment(row))

        return comments


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    text = db.Column(db.String(2048), nullable=False)

    upvotes = db.Column(db.Integer, nullable=False)
    downvotes = db.Column(db.Integer, nullable=False)

    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    user_id = db.Column(db.Integer, db.ForeignKey('account.id'),
                           nullable=False)

    post_id = db.Column(db.Integer, db.ForeignKey('post.id'),
                           nullable=False)
    
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'),
                           nullable=True)

    def __init__(self, text, upvotes, downvotes):
        self.text = text
        self.upvotes = upvotes
        self.downvotes = downvotes

    

class PostVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    post_id = db.Column(db.Integer, db.ForeignKey('post.id'),
                           nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('account.id'),
                           nullable=False)

    like = db.Column(db.Boolean, nullable=False)

    def __init__(self, post_id, user_id, like):
        self.post_id = post_id
        self.user_id = user_id
        self.like = like
    
    @staticmethod
    def get_vote(post_id, user_id, like):
        return PostVote.query.filter_by(post_id=post_id, user_id=user_id, like=like).first()

class CommentVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'),
                           nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('account.id'),
                           nullable=False)

    like = db.Column(db.Boolean, nullable=False)

    def __init__(self, comment_id, user_id, like):
        self.comment_id = comment_id
        self.user_id = user_id
        self.like = like

## Schemas

class CommentSchema(ma.ModelSchema):
    class Meta:
        model = Post

class PostSchema(ma.ModelSchema):
    class Meta:
        model = Post

post_schema = PostSchema()
posts_schema = PostSchema(many=True)

comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)