from application import db, ma

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(144), nullable=False)
    text = db.Column(db.String(2048), nullable=False)

    upvotes = db.Column(db.Integer, nullable=False)
    downvotes = db.Column(db.Integer, nullable=False)

    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, title, text, upvotes, downvotes):
        self.title = title
        self.text = text
        self.upvotes = upvotes
        self.downvotes = downvotes

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    text = db.Column(db.String(2048), nullable=False)

    upvotes = db.Column(db.Integer, nullable=False)
    downvotes = db.Column(db.Integer, nullable=False)

    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, title, text):
        self.text = text

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