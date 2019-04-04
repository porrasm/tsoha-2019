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

        if (!post) {
            console.log('Something went wrong...')
            return
        }

        const request = comments.createComment(this.state.comment_text, post.id)

        request.then(res => {

            if (res.message) {

                console.log('Comment created successfully')

                this.setState({message: 'Created comment', comment: null})
            } else {

                console.log('Commenting failed')
                this.setState({message: 'Failed to create comment'})        
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


        return (
            <div>
                <h3>Write comment</h3>

                {message}

                <form onSubmit={this.comment.bind(this)}>
                    <div>
                        Comment text
                        <input
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