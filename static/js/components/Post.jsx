import React from "react";
import posts from '../services/posts'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Table, Message, Container, Divider, Header } from 'semantic-ui-react'


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

        return comments.map(comment => (
            <Comment comment={comment} key={comment.id}/>
        ))
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

        const commentForm = user ? (<CommentForm post={this.state.post}/>) : null

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