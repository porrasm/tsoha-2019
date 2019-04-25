# ReadIt Forum
[Main page](https://github.com/porrasm/tsoha-2019)

[ReadIt Forum on Heroku](https://readit-forum.herokuapp.com/)

# Requirement specification

This application should have all the basic features of an online forum. All users (registered or unregistered) should be able to browse the forum without restrictions. Only registered users should be able to take part in the discussions (which includes creating posts and commenting on them).

The forum should have a voting system based on likes and dislikes (upvotes and downvotes). Unlike many other forums, this one should show both the likes and dislikes instead of the 'likes - dislikes' value.

Registering should require the user to give an email or a username (or both) and set a password. Alternatively, if there is time, the user could be able to sign in using a GitHub account.

Editing posts or comments should not be allowed.

## User stories

### Basic functionality

- users can view posts
- users can search for posts
- users can filter posts
- the amount of likes and dislikes will be visible

### Account management

- a user can create an account
- a user can sign in
- a user can delete his or her account

### Signed in users

- a signed in user can create posts
- a signed in user can create comments
- a signed in user can reply to a comment
- a signed in user can upvote/downvote posts
- a signed in user can upvote/downvote comments
- a signed in user can view his or her posts
- a signed in user can delete his or her post
- a signed in user can delete his or her comment

## Current functionality

### Basic functionality

- users can view posts
- the amount of likes and dislikes will be visible

### Account management

- a user can create an account
- a user can sign in
- a user can delete his or her account

### Signed in users

- a signed in user can create a posts
- a signed in user can create comments
- a signed in user can reply to a comment
- a signed in user can upvote/downvote posts
- a signed in user can upvote/downvote comments (refresh browser)
- a signed in user can delete his or her post
- a signed in user can delete his or her comment (refresh browser)