import React from "react";
import posts from '../services/posts'
import CommentContainer from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Container, Divider, Header, Comment, Label } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

class Post extends React.Component {
    constructor(props) {
        super(props)

        console.log('PROPS: ', this.props)

        const id = this.props.match.params.id

        this.state = {
            page: 1,
            got_page: 0,
            comment_response: null,
            id: id,
            post: null,
            deleted: false
        }
    }

    componentDidMount() {
        this.updatePost()
    }
    componentDidUpdate() {
        this.updatePost()
    }

    updatePost() {

        const page = this.state.page

        if (page == this.state.got_page) {
            return
        }

        const request = posts.getOne(this.state.id, page)

        request.then(response => {
            console.log("get post response: ", response)
            this.setState({ post: response, got_page: page })
        })
    }

    changePage(amount) {

        if (this.state.page + amount < 1) {
            return
        }

        const newAmount = this.state.page + amount

        this.setState({ page: newAmount })
    }

    comments() {

        const user = this.props.userContainer.current_user ? this.props.userContainer.current_user : false

        const comments = this.mapCommentResponses(this.state.post.comments)

        console.log('Rendering comments: ', comments)

        if (!comments) {
            return null
        }

        const commentList = comments.map(comment => (
            <CommentContainer comment={comment} key={comment.id} user={user}
                setCommentResponseID={this.setCommentResponseID.bind(this)} />
        ))

        return (
            <div>
                <Comment.Group>
                    {commentList}
                </Comment.Group>
                <Label onClick={() => this.changePage(-1)}>Previous page</Label> <Label>{this.state.page}</Label> <Label onClick={() => this.changePage(1)}>Next page</Label>
            </div>
        )
    }
    mapCommentResponses(oldComments) {

        const comments = new Map()
        let orderIndex = 1

        for (let comment of oldComments.sort((a, b) => new Date(a.date_created) - new Date(b.date_created))) {
            comment.order_id = orderIndex
            orderIndex++
            comments.set(comment.id, comment)
        }

        return oldComments.map(comment => {
            if (comment.response_id) {
                const responseTo = comments.get(comment.response_id)
                try {
                    comment.response_to = { username: responseTo.user_username, order_id: responseTo.order_id }
                } catch (error) {
                    comment.response_to = "RESPONSE"
                }
            }
            return comment
        })
    }

    like(event) {
        event.preventDefault()

        const req = posts.like(this.state.post.id)
        req.then(res => {
            console.log('Like: ', res)
            const post = this.state.post
            post.upvotes += res.value
            post.downvotes += res.opposite_value
            this.setState({ post })
        })

    }
    dislike(event) {
        event.preventDefault()

        const req = posts.dislike(this.state.post.id)
        req.then(res => {
            console.log('Dislike: ', res)
            const post = this.state.post
            post.downvotes += res.value
            post.upvotes += res.opposite_value
            this.setState({ post })
        })
    }
    appendComment(comment) {
        const post = this.state.post
        post.comments = post.comments.concat(comment)
        this.setState({ post })
    }
    updateComment(newComment) {
        const post = this.state.post

        for (let i = 0; i < post.comments; i++) {
            if (post.comments[i].id == newComment.id) {
                post.comments[i] = newComment
                break
            }
        }

        this.setState({ post })
    }
    deletePost() {

        if (!window.confirm("Are you sure you wish to delete this post?")) {
            return
        }

        const req = posts.deletePost(this.state.post.id)
        req.then(res => {
            if (res) {
                console.log('Deleted post')
                this.setState({ deleted: true })
            }
        })
    }
    setCommentResponseID(response) {

        if (this.state.comment_response) {
            if (this.state.comment_response.id == response.id && this.state.comment_response.edit == response.edit) {
                console.log('Resetting response: ', response)
                this.setState({ comment_response: null })
                return
            }
        }

        console.log('Setting response to: ', response)
        this.setState({ comment_response: response })
    }

    render() {

        if (this.state.deleted) {
            console.log('Redirecting to home')
            return <Redirect to='/' />
        }

        console.log('Post: ', this.state.post)

        const user = this.props.userContainer.current_user

        if (!this.state.post) {
            return (
                <div>Loading...</div>
            )
        }

        const comments = this.comments()

        console.log('Giving comment form new props: ', this.state.comment_response)
        const commentForm = user ? (
            <CommentForm post={this.state.post}
                appendComment={this.appendComment.bind(this)}
                updateComment={this.updateComment.bind(this)}
                comment_response={this.state.comment_response} />) : null

        let deleteButton = null
        if (user) {
            if (user.username == "admin" || user.id == this.state.post.user.id) {
                deleteButton = (<Label onClick={this.deletePost.bind(this)}>Delete post</Label>)
            }
        }

        const buttonActions = user ? (<div>
            <Label onClick={this.like.bind(this)}>Like</Label>
            <Label onClick={this.dislike.bind(this)}>Dislike</Label>
            {deleteButton}
        </div>) : null

        const userLink = "/users/" + this.state.post.user.id

        return (
            <div>
                <Container textAlign='left'>
                    <br />
                    <p>Post by: <Link to={userLink}>{this.state.post.user.username}</Link></p>

                    <Header as='h2'>{this.state.post.title}</Header>

                </Container>
                <Container textAlign='left' >
                    <Divider />
                    <p style={{ whiteSpace: 'pre-wrap' }}>{this.state.post.text}</p>
                </Container>

                <Container textAlign='left' >
                    <Divider />

                    <p>Upvotes: {this.state.post.upvotes}</p>
                    <p>Downvotes: {this.state.post.downvotes}</p>
                    {buttonActions}
                    <Header as='h2'>Comments</Header>
                    {commentForm}
                    {comments}
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userContainer: state.userContainer,
    }
}

const ConnectedPost = connect(
    mapStateToProps
)(Post)

export default ConnectedPost