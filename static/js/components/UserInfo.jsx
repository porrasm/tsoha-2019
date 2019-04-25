import React from "react";
import posts from '../services/posts'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Table, Message, Container, Divider, Header } from 'semantic-ui-react'
import users from '../services/users'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { setCurrentUser } from '../reducers/userReducer'


class UserInfo extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            info: null
        }
    }

    componentDidMount() {

        const request = users.getUserInfo(this.props.user)
        request.then(response => {
            console.log('Received user info response: ', response)
            this.setState({info: response})
        })
    }

   
    render() {

        const info = this.state.info

        if (!info) {
            return null
        }

        return (
            <div>
                
                <Header as="h2">
                    Stats
                </Header>

                <p>Post Like Ratio: {info.post_like_ratio}</p>
            </div>
        )
    }
}

export default UserInfo