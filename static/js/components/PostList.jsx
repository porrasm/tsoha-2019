import React from 'react'

import posts from '../services/posts'

import { Table, Message } from 'semantic-ui-react'

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
    return (
            <Table.Row key={post.id}>
                <Table.Cell>
                    <Message>
                        <Message.Header>{post.title}</Message.Header>
                        <p>{post.text}</p>
                    </Message>
                </Table.Cell>
            </Table.Row>
    )
}

export default PostList