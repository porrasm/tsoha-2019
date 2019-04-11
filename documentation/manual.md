# ReadIt Forum
[Main page](https://github.com/porrasm/tsoha-2019)

[ReadIt Forum on Heroku](https://readit-forum.herokuapp.com/)

## Installation

- Clone this repository
- Create a virtual environment
- Install all requirements via `pip install -r requirements.txt`
- Run the application via `python run.py` or `python3 run.py`
- The application uses the port 5000 so visit the application in [here](localhost:5000)

## How to use

Usage of the application is simple. You can navigate via the top navigation bar, which functionalities are quite self-evident.

In order to create a post you need to be signed in. Register a new account or sign in using the test admin account (admin, 12345). Username and passwords should be between 5-32 characters and the username cannot contain any special characters.

You can edit your account information by clicking your name in the navigation bar. You can change your username or password. If you wish to change only one of them, leave the other field empty. You must provide your previous password to edit the account.

While signed in you can create posts, comment on posts and like or dislike posts. You can also delete your own post. The admin account can delete anyones post.

If you delete a post all comments on the post will also be deleted. If you delete your account, your every comment and post (along with other comments in your posts) will be deleted.
