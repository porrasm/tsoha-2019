import React, { useState } from 'react';
import comments from '../services/comments'

class CommentForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comment_text: '',
            saved_text: '',
            edit_id: null,
            edit_comment: null,
            message: null
        }
    }

    comment(event) {

        event.preventDefault()

        if (this.state.edit_id && this.props.comment_response.edit) {
            this.updateComment()
            return
        } 

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
    updateComment() {
        const newComment = this.props.comment_response.edit_comment
        newComment.text = this.state.comment_text

        const request = comments.updateComment(newComment)

        request.then(res => {

            if (res.text) {

                console.log('Comment updated successfully')

                this.setState({ message: 'Updated comment', comment: null })
            } else {

                console.log('Comment update failed: ', res)
                this.setState({ message: 'Failed to update comment' })
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

    componentDidUpdate() {
        this.updateEdits()
    }

    updateEdits() {
        const response = this.props.comment_response

        console.log('DID UPDATE: ', response)

        if (response) {
            if (response.edit) {


                if (!this.state.edit_id) {
                    const oldText = this.state.comment_text
                    this.setState({ comment_text: response.edit_text, edit_id: response.id, saved_text: oldText })
                } else {
                    if (this.state.edit_id != response.id) {
                        this.setState({ comment_text: response.edit_text, edit_id: response.id })
                    }
                }

            } else if (this.state.edit_id) {
                const savedText = this.state.saved_text
                this.setState({ edit_id: null, comment_text: savedText, saved_text: null })
            }

        } else if (this.state.edit_id) {
            const savedText = this.state.saved_text
            this.setState({ edit_id: null, comment_text: savedText, saved_text: null })
        }

        return

        if (response) {
            if (response.edit) {
                // HERE WE SHOULD RE RENDER

                if (this.state.edit_id != response.id) {
                    const oldText = this.state.comment_text
                    this.setState({ comment_text: response.edit_text, edit_id: response.id, saved_text: oldText })
                }
            } else if (this.state.edit_id) {
                this.setState({ edit_id: null })
            }

        }

        return


        return


        return
        if (response) {
            if (response.edit) {
                // Editing comment

                if (!response.edit_id) {
                    // Setting comment field text
                    this.setState({ comment_text: response.edit_text, edit_id: response.id })
                } else if (response.edit_id != response.id) {
                    this.setState({ comment_text: response.edit_text, edit_id: response.id })
                }
            } else {
                if (this.state.edit_id) {
                    // Resetting edit state to reply state
                    this.setState({ edit_id: null })
                }
            }
        }
    }



    render() {

        console.log('Rendering comment form: ', this.state)

        let textValue = this.state.comment_text

        const message = this.state.message ? (<p>{this.state.message}</p>) : null
        let commentMessage = null

        const response = this.props.comment_response
        console.log('TRUE UPDATE: ', response)

        if (response) {
            if (response.edit) {
                commentMessage = (<p>Editing comment #{response.order_id}</p>)
            } else {
                commentMessage = (<p>Replying to {response.username} #{response.order_id}</p>)
            }
        }

        return (
            <div>
                <h3>Write comment</h3>

                {message}

                {commentMessage}

                <form onSubmit={this.comment.bind(this)}>
                    <p>Comment text</p>
                    <div>
                        <textarea
                            value={textValue}
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