import React from "react";
import posts from '../services/posts'
import { Table, Message, Container, Divider, Comment, Form } from 'semantic-ui-react'
import comments from '../services/comments'

class CommentContainer extends React.Component {

    render() {

        const comment = this.props.comment
        const response = comment.response_to ? (<div>Response to: {comment.response_to}:{"\n"}</div>) : null
        const actions = this.props.login ? (
            <Comment.Actions>
                <Comment.Action onClick={() => comments.like(comment.id)}>Like</Comment.Action>
                <Comment.Action onClick={() => comments.dislike(comment.id)}>Dislike</Comment.Action>
                <Comment.Action onClick={() => this.props.setCommentResponseID({ id: comment.id, username: comment.user_username })}>Reply</Comment.Action>
            </Comment.Actions>) : null

        if (!comment) {
            return null
        }

        return (
            <div>
                <Divider />
                <Comment>
                    <Comment.Content>

                        <Comment.Author>{comment.user_username}</Comment.Author>

                        <Comment.Metadata>
                            {response}
                            <div>Likes: {comment.upvotes}</div>
                            <div>Dislikes: {comment.downvotes}</div>
                            <div>Date: {comment.date_created}</div>
                        </Comment.Metadata>

                        <Comment.Text>
                            <p style={{whiteSpace: 'pre-line'}}>{comment.text}</p>
                        </Comment.Text>

                        {actions}
                    </Comment.Content>

                </Comment>
            </div>
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