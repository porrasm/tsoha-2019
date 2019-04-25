import React from "react";
import posts from '../services/posts'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Table, Message, Container, Divider, Header, Tab } from 'semantic-ui-react'
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
            this.setState({ info: response })
        })
    }

    jsonToTable(json) {

        const rows = []

        for (let key in json) {
            const row = (<Table.Row>
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

        words.charAt(0).toUpperCase()

        return words
    }

    render() {

        const info = this.state.info

        if (!info) {
            return <p>Login expired</p>
        }

        return (
            <div>

                <Container textAlign='center'>
                    <Header as="h2">
                        Stats
                    </Header>
                    {this.jsonToTable(info)}
                </Container>

            </div>
        )
    }
}

export default UserInfo