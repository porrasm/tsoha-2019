from application import db, ma
from werkzeug.security import safe_str_cmp
from application.posts.postModels import Post, Comment
import application.users.user_sql_statements as stmts

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
        stmt = stmts.post_amount_stmt(self.id)

        response = db.engine.execute(stmt)

        value = response.first()[0]

        return value

    def post_like_ratio(self):

        # Likes / Likes + Dislikes
        stmt = stmts.post_like_ratio_stmt(self.id)

        response = db.engine.execute(stmt)

        value = response.first()[0]

        print("\nUser like ratio response: ", value)

        return value

    def comment_amount(self):
        stmt = stmts.comment_amount_stmt(self.id)

        response = db.engine.execute(stmt)

        value = response.first()[0]

        return value

    def comment_like_ratio(self):

        # Likes / Likes + Dislikes
        stmt = stmts.comment_like_ratio_stmt(self.id)

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

        stmt = stmts.most_active_users_stmt()

        response = db.engine.execute(stmt)

        users = []

        for row in response:

            row_dict = {
                "username": row.username,
                "id": row.id,
                "value": row.post_count
            }

            users.append(row_dict)

        return users

    @staticmethod
    def highest_rated_users():

        stmt = stmts.highest_rated_users_stmt()

        response = db.engine.execute(stmt)

        users = []

        for row in response:

            row_dict = {
                "username": row.username,
                "id": row.id,
                "value": row.like_ratio
            }

            print("User like ratio: ", row.like_ratio)

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