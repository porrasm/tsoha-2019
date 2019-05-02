import React from "react";
import posts from '../services/posts'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Table, Message, Container, Divider, Header, Tab } from 'semantic-ui-react'
import users from '../services/users'
import { Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { setCurrentUser } from '../reducers/userReducer'


class UserInfo extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            info: null,
            posts: []
        }
    }

    componentDidMount() {

        console.log('Getting user info: ', this.props.user_id)

        const user_request = users.getUserInfo(this.props.user_id)
        const post_request = posts.getByUserID(this.props.user_id)
        user_request.then(response => {
            console.log('Received user info response: ', response)
            this.setState({ info: response })
        })
        post_request.then(response => {

            if (!response) {
                console.log('Posts were null')
                return
            }

            console.log('Received user info response: ', response)
            this.setState({ posts: response })
        })
    }

    jsonToTable(json) {

        const rows = []
        let tableKey = 0
        for (let key in json) {

            if (key.charAt(0) == '_') {
                continue
            }

            const row = (<Table.Row key={tableKey++}>
                <Table.Cell>{this.jsonKeyToString(key)}</Table.Cell>
                <Table.Cell>{json[key]}</Table.Cell>
            </Table.Row>)

            rows.push(row)
        }

        return (<Table>
            <Table.Body>
                {rows}
            </Table.Body>
        </Table>)
    }
    jsonKeyToString(key) {
        const words = key
            .replace(/_/g, " ")
            .toLowerCase()
            .trim()

        return words.charAt(0).toUpperCase() + words.substr(1)
    }

    postListings() {

        console.log('in post listings: ', posts.length)
    
        return (
            <Table>
                <Table.Body>
                    {this.state.posts.map(post => this.singlePost(post))}
    
                </Table.Body>
            </Table>
        )
    }  
    singlePost(post) {
    
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

    render() {

        const info = this.state.info

        if (!info) {
            return <Container textAlign='center'><p>Login expired</p></Container>
        }

        return (
            <div>

                <Container textAlign='center'>
                    <Header as="h2">
                        Stats
                    </Header>
                    <Header as="h3">{info._username}</Header>
                    {this.jsonToTable(info)}
                    <Divider />
                    <Header as="h2">
                        Posts by {info._username}
                    </Header>
                    {this.postListings()}

                </Container>

            </div>
        )
    }
}

export default UserInfo