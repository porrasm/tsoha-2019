from application import db, ma
from werkzeug.security import safe_str_cmp

# Models
class User(db.Model):

    __tablename__ = "account"
  
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
                              onupdate=db.func.current_timestamp())

    username = db.Column(db.String(32), nullable=False)
    password = db.Column(db.String(32), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password
    
    def get_id(self):
        return self.id

    def password_equals(self, other_password):
        return safe_str_cmp(self.password.encode('utf-8'), other_password.encode('utf-8'))

    @staticmethod
    def get_user_by_username(username):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_user_by_id(id):
        return User.query.filter_by(id=id).first()

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