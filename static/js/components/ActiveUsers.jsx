import React from 'react'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import users from '../services/users'

import { Table, Message, Divider, Container } from 'semantic-ui-react'

class ActiveUsers extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            users: []
        }
    }

    componentDidMount() {

        const request = users.getActiveUsers()

        request.then(response => {
            this.setState({ users: response })
        })
    }



    render() {

        console.log('users: ', this.state.users)

        const table = userListing(this.state.users)

        return (
            <Container>
                <br /><br />
                <h2>Top 10 active posters in the last 7 days</h2>
                <Divider />
                {table}
            </Container>
        )
    }
}

const userListing = (users) => {

    console.log('in user listings: ', users.length)

    return (
        <Table>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>User</Table.HeaderCell>
                    <Table.HeaderCell>Post amount</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {users.map(user => singleUser(user))}
            </Table.Body>
        </Table>
    )
}

const singleUser = (user) => {

    const postUrl = "/posts/" + user.id
    console.log(postUrl)

    return (
        <Table.Row key={user.id}>
            <Table.Cell>
                {user.username}
            </Table.Cell>
            <Table.Cell>
                {user.post_count}
            </Table.Cell>
        </Table.Row>
    )
}


export default ActiveUsers