# ReadIt Forum
[Main page](https://github.com/porrasm/tsoha-2019)

[ReadIt Forum on Heroku](https://readit-forum.herokuapp.com/)

## Installation

- Clone this repository
- Create a virtual environment via `python3 -m venv venv`
- Activate the environment via `source venv/bin/activate` or `source venv/Scripts/activate`
- Install all requirements via `pip install -r requirements.txt`
- Run the application via `python run.py` or `python3 run.py`
- The application uses the port 5000 so visit the application in [here](localhost:5000)

## How to use

Usage of the application is simple. You can navigate via the top navigation bar, which has links to most important locations.

### Home page and signing in

You can view posts on the Home page. This will list all the posts on the site.

The menu bar has a link to the 'Register' and 'Login' pages. Fill in all the required information to register or sign in. Username and passwords should be between 5-32 characters and the username cannot contain any special characters.

When signed in you can create and vote posts and comments. 

### Posts and comments

The 'Create post' link will take you to the create post page where you will see two text fields, one for the title and one for the text. Click submit to create the post. This will automatically upvote the post and redirect you to the newly created post page.

Click on any post to see more information on it. While in the post page you can upvoted or downvote the post. Below the post are all the comments and the commenting field. Write your comment and click submit to create comment.

You can reply and or edit comments. Click 'reply' on any comment to reply to it. The comment field will display which comment you're replying to or if you are editing a comment. Write your comment as you normally would to reply or edit the comment.

### User views

You can view any users page and all his posts. The page will also show various statistics on the user.

Click on any users name from a post or comment field to visit their page. If you click your own name on a post or comment field or in the navigation bar you can also edit your account.

Editing your account is simple. Fill in the new username or password to update your account. You need to type in your old password in order to change any information.

If you wish to delete your account click 'Delete account'. This will delete your account, all your posts and comments along with other peoples comments in your posts. This will not, however, remove your upvotes or downvotes on posts and comments although people can't see that you have liked them.

### Top users page

On the home page click 'Top users' to visit the top users page. This page will show the top 10 most active users in the past week and the top 10 highest rated users. Click on their names to visit their user pages.