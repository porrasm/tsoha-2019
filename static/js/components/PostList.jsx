import React from 'react'
import { Link } from 'react-router-dom'
import posts from '../services/posts'
import { Table, Message, Divider, Container, Label } from 'semantic-ui-react'

class PostList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            page: 1,
            got_page: 0,
            posts: []
        }
    }

    componentDidMount() {
        this.updatePosts()
    }
    componentDidUpdate() {
        this.updatePosts()
    }
    updatePosts() {

        if (this.state.page == this.state.got_page) {
            return
        }

        const page = this.state.page

        console.log('Update posts: ', page)

        let request = null

        const user_id = this.props.user_id

        if (user_id) {
            request = posts.getByUserID(user_id, page)
        } else {
            request = posts.getAll(page)
        }

        request.then(response => {
            this.setState({ posts: response, got_page: page })
        })
    }
    changePage(amount) {

        if (this.state.page + amount < 1) {
            return
        }

        const newAmount = this.state.page + amount

        this.setState({ page: newAmount })
    }


    render() {

        console.log('posts: ', this.state.posts)

        const postsTable = postListings(this.state.posts)
        console.log(postsTable)

        return (
            <div>
                {postsTable}
                <Container textAlign='right'><Label onClick={() => this.changePage(-1)}>Previous page</Label> <Label>{this.state.page}</Label> <Label onClick={() => this.changePage(1)}>Next page</Label></Container>
            </div>
        )
    }
}

const postListings = (posts) => {

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

export default PostList