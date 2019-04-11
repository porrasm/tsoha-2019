import React from "react";
import posts from '../services/posts'
import CommentContainer from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Table, Message, Container, Divider, Header, Comment } from 'semantic-ui-react'


import { connect } from 'react-redux'
import { setCurrentUser } from '../reducers/userReducer'

class Post extends React.Component {
    constructor(props) {
        super(props)

        console.log('PROPS: ', this.props)

        const id = this.props.match.params.id

        this.state = {
            id: id,
            post: null
        }
    }

    componentDidMount() {

        const request = posts.getOne(this.state.id)

        request.then(response => {
            this.setState({ post: response })
        })
    }

    comments() {

        const comments = this.state.post.comments

        console.log('Rendering comments: ', comments)

        if (!comments) {
            return null
        }

        const commentList = comments.map(comment => (
            <CommentContainer comment={comment} key={comment.id} />
        ))

        return (<Comment.Group>
            {commentList}
        </Comment.Group>)
    }

    like(event) {
        event.preventDefault()

        const req = posts.like(this.state.post.id)
        req.then(res => {
            console.log('Like: ', res)
            const post = this.state.post
            post.upvotes += res.value
            post.downvotes += res.opposite_value
            this.setState({post})
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
            this.setState({post})
        })
    }
    appendComment(comment) {
        const post = this.state.post
        post.comments = post.comments.concat(comment)
        this.setState({post})
    }

    render() {

        console.log('Post: ', this.state.post)

        const user = this.props.userContainer.current_user

        if (!this.state.post) {
            return (
                <div>Loading...</div>
            )
        }

        const comments = this.comments()

        const commentForm = user ? (<CommentForm post={this.state.post} appendComment={this.appendComment.bind(this)}/>) : null

        return (
            <div>
                <Container textAlign='left'>
                    <p>Post by: {this.state.post.user.username}</p>

                    <Header as='h2'>{this.state.post.title}</Header>

                </Container>
                <Container textAlign='left'>

                    <Divider />
                    <p>
                        {this.state.post.text}
                    </p>
                </Container>

                <Container textAlign='left' >
                    <Divider />

                    <p>Upvotes: {this.state.post.upvotes}</p>
                    <p>Downvotes: {this.state.post.downvotes}</p>
                    <div>
                        <button onClick={this.like.bind(this)}>Like</button>
                        <button onClick={this.dislike.bind(this)}>Dislike</button>
                    </div>
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