from application import db, ma
from werkzeug.security import safe_str_cmp
from application.posts.postModels import Post, Comment
from sqlalchemy.sql import text

# Models
class User(db.Model):

    __tablename__ = "account"
  
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
                              onupdate=db.func.current_timestamp())

    username = db.Column(db.String(32), nullable=False)
    password = db.Column(db.String(32), nullable=False)

    is_admin = db.Column(db.Boolean, nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.is_admin = False
    
    def get_id(self):
        return self.id

    def password_equals(self, other_password):
        return safe_str_cmp(self.password.encode('utf-8'), other_password.encode('utf-8'))

    def posts_by_user(self):
        Post.query.filter_by()

    def post_amount(self):
        stmt = text(f"""SELECT COUNT(*) FROM Post WHERE Post.user_id = {self.id} """)

        response = db.engine.execute(stmt)

        value = response.first()[0]

        return value

    def post_like_ratio(self):

        # Likes / Likes + Dislikes
        stmt = text(f"""SELECT 
        CAST((SELECT SUM(upvotes) FROM Post WHERE Post.user_id = {self.id}) AS FLOAT) 
        / 
        CAST(((SELECT SUM(upvotes) FROM Post WHERE Post.user_id = {self.id}) + (SELECT SUM(downvotes) FROM Post WHERE Post.user_id = {self.id})) AS FLOAT)""")

        response = db.engine.execute(stmt)

        value = response.first()[0]

        print("\nUser like ratio response: ", value)

        return value

    def comment_amount(self):
        stmt = text(f"""SELECT COUNT(*) FROM Comment WHERE Comment.user_id = {self.id} """)

        response = db.engine.execute(stmt)

        value = response.first()[0]

        return value

    def comment_like_ratio(self):

        # Likes / Likes + Dislikes
        stmt = text(f"""SELECT 
        CAST((SELECT SUM(upvotes) FROM Comment WHERE Comment.user_id = {self.id}) AS FLOAT) 
        / 
        CAST(((SELECT SUM(upvotes) FROM Comment WHERE Comment.user_id = {self.id}) + (SELECT SUM(downvotes) FROM Comment WHERE Comment.user_id = {self.id})) AS FLOAT)""")

        response = db.engine.execute(stmt)

        value = response.first()[0]

        print("\nUser like ratio response: ", value)

        return value


    @staticmethod
    def get_user_by_username(username):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_user_by_id(id):
        return User.query.filter_by(id=id).first()

    @staticmethod
    def most_active_users():

        stmt = text(f"""SELECT Account.username, Account.id, COUNT(*) as post_count
                        FROM Account LEFT JOIN Post ON Account.id = Post.user_id
                        AND Post.date_created <= DATE('now', '-7 day')
                        GROUP BY Account.username ORDER BY post_count DESC LIMIT 10""")

        response = db.engine.execute(stmt)

        users = []

        for row in response:

            row_dict = {
                "username": row.username,
                "id": row.id,
                "post_count": row.post_count
            }

            users.append(row_dict)

        return users

    @staticmethod
    def create_admin():
        
        print("\nCreating admin")

        exists = User.query.filter_by(username="admin").first()

        if exists:
            print("Admin existed: ", exists)
            return

        print("Adding admin to database")

        admin = User("admin", "12345")
        admin.is_admin = True
        db.session().add(admin)
        db.session().commit()




def authenticate(username, password):
    user = User.query.filter_by(username=username).first()

    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user
    



# Schemas

class UserSchema(ma.ModelSchema):
    class Meta:
        model = User

user_schema = UserSchema()
users_schema = UserSchema(many=True)