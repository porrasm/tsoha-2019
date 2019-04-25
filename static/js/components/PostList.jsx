import React from 'react'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import posts from '../services/posts'

import { Table, Message, Divider, Container } from 'semantic-ui-react'

class PostList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            posts: []
        }
    }

    componentDidMount() {

        const request = posts.getAll()

        request.then(response => {
            this.setState({ posts: response })
        })
    }



    render() {

        console.log("render, length: ", this.state.posts.length)
        console.log('posts: ', this.state.posts)

        const html = postListings(this.state.posts)
        console.log(html)
        return html
    }
}

const postListings = (posts) => {

    console.log('in post listings: ', posts.length)

    return (
        <Table>
            <Table.Body>
                {posts.map(post => singlePost(post))}

            </Table.Body>
        </Table>
    )
}

const singlePost = (post) => {

    const postUrl = "/posts/" + post.id
    console.log(postUrl)

    return (
        <Table.Row key={post.id}>
            <Table.Cell>
               
                    <Message>
                        <Message.Header><Link to={postUrl}>{post.title}</Link></Message.Header>
                        <div>Likes {post.upvotes}</div>
                        <div>Dislikes {post.downvotes}</div>
                        <Divider />
                        <p>{post.text}</p>
                    </Message>
            
            </Table.Cell>
        </Table.Row>
    )
}

/*
<p>POST LINK <Link to={postUrl}>Posts</Link></p>
                    <p>{post.text}</p> 
*/

export default PostList