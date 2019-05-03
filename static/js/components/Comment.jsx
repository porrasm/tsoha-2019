import React from "react";
import { Message, Divider, Comment } from 'semantic-ui-react'
import comments from '../services/comments'
import { Link } from 'react-router-dom'

class CommentContainer extends React.Component {

    render() {

        const comment = this.props.comment
        const response = comment.response_to ? (<div>Response to: #{comment.response_to.order_id} {comment.response_to.username} :{"\n"}</div>) : null

        const userActions = this.props.user.id == this.props.comment.user_id || this.props.user.username == 'admin' ?
            (<span><Comment.Action onClick={() => this.props.setCommentResponseID({ edit: true, id: comment.id, order_id: comment.order_id, edit_text: comment.text, edit_comment: comment })}>Edit</Comment.Action>
                <Comment.Action onClick={() => comments.delete(comment.id)}>Delete</Comment.Action></span>) : null

        console.log('DELETE ACTION: ', userActions)

        const actions = this.props.user ? (
            <Comment.Actions>
                <Comment.Action onClick={() => comments.like(comment.id)}>Like</Comment.Action>
                <Comment.Action onClick={() => comments.dislike(comment.id)}>Dislike</Comment.Action>
                <Comment.Action onClick={() => this.props.setCommentResponseID({ id: comment.id, username: comment.user_username, order_id: comment.order_id })}>Reply</Comment.Action>
                {userActions}
            </Comment.Actions>) : null

        if (!comment) {
            return null
        }

        const userLink = "/users/" + comment.user_id

        return (
            <div>
                <Divider />
                <Comment>
                    <Comment.Content>

                        <Comment.Author>#{comment.order_id} <Link to={userLink}>{comment.user_username}</Link></Comment.Author>

                        <Comment.Metadata>
                            {response}
                            <div>Likes: {comment.upvotes}</div>
                            <div>Dislikes: {comment.downvotes}</div>
                            <div>Date: {comment.date_created}</div>
                        </Comment.Metadata>

                        <Comment.Text>
                            <p style={{ whiteSpace: 'pre-line' }}>{comment.text}</p>
                        </Comment.Text>

                        {actions}
                    </Comment.Content>

                </Comment>
            </div>
        )
    }
}

export default CommentContainer