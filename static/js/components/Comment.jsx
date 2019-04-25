import React from "react";
import posts from '../services/posts'
import { Table, Message, Container, Divider, Comment, Form } from 'semantic-ui-react'

class CommentContainer extends React.Component {

    render() {

        const comment = this.props.comment
        const response = comment.response_to ? (<div>Response to: {comment.response_to}</div>) : null

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
                            {response}
                        </Comment.Metadata>

                        <Comment.Text>
                            {comment.text}
                        </Comment.Text>

                        <Comment.Actions>
                            <Comment.Action onClick={() => this.props.setCommentResponseID({id: comment.id, username: comment.user_username})}>Reply</Comment.Action>
                        </Comment.Actions>
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