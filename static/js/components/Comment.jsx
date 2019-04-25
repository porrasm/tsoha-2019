import React from "react";
import posts from '../services/posts'
import { Table, Message, Container, Divider, Comment } from 'semantic-ui-react'

class CommentContainer extends React.Component {

    render() {

        const comment = this.props.comment

        if (!comment) {
            return null
        }

        return (
            <Message>
                <Comment>
                    <Comment.Content>

                        <Comment.Author>{comment.user_username}</Comment.Author>

                        <Comment.Metadata>
                            <div>Likes: {comment.upvotes}</div>
                            <div>Dislikes: {comment.downvotes}</div>
                            <div>Date: {comment.date_created}</div>
                        </Comment.Metadata>

                        <Comment.Text>
                            {comment.text}
                        </Comment.Text>
                    </Comment.Content>

                </Comment>
            </Message>
        )

        return (
            <div>
                <Message>
                    <p>{comment.text}</p>
                </Message>
            </div>
        )
    }
}

export default CommentContainer