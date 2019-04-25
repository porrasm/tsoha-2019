import React, { useState } from 'react';
import comments from '../services/comments'

class CommentForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comment_text: '',
            message: null
        }
    }

    comment(event) {
        event.preventDefault()

        console.log('Creating comment for post')

        const post = this.props.post
        const commentId = this.props.comment_response ? this.props.comment_response.id : null

        if (!post) {
            console.log('Something went wrong...')
            return
        }

        const request = comments.createComment(this.state.comment_text, post.id, commentId)

        request.then(res => {

            if (res.text) {

                console.log('Comment created successfully')

                this.setState({ message: 'Created comment', comment: null })
                this.props.appendComment(res)
            } else {

                console.log('Commenting failed: ', res)
                this.setState({ message: 'Failed to create comment' })
            }
            this.removeMessage()
        })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }
    removeMessage() {
        setTimeout(() => {
            this.setState({
                message: null
            })
        }, 5000)
    }

    render() {

        console.log('Rendering comment form')

        const message = this.state.message ? (<p>{this.state.message}</p>) : null
        const responseMessage = this.props.comment_response ? (<p>Replying to {this.props.comment_response.username}</p>) : null

        return (
            <div>
                <h3>Write comment</h3>

                {message}

                {responseMessage}

                <form onSubmit={this.comment.bind(this)}>
                    <p>Comment text</p>
                    <div>
                        <textarea
                            value={this.state.username}
                            name='comment_text'
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default CommentForm