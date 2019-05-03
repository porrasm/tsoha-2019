import React from 'react'
import { Link } from 'react-router-dom'
import users from '../services/users'
import { Table, Divider, Container } from 'semantic-ui-react'

class TopUsers extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            active_users: [],
            rated_users: []
        }
    }

    componentDidMount() {

        const active_request = users.getActiveUsers()
        const rated_request = users.getRatedUsers()

        active_request.then(response => {
            this.setState({ active_users: response })
        })
        rated_request.then(response => {
            this.setState({ rated_users: response })
        })
    }

    render() {

        console.log('users: ', this.state.active_users)

        const table_a = userListing(this.state.active_users, 'User', 'Post amount')
        const table_b = userListing(this.state.rated_users.map(user => {
            user.value = (user.value * 100).toFixed(1) + '%'
            return user
        }), 'User', 'Like ratio')

        return (
            <Container>
                <br /><br />
                <h2>Top 10 active posters in the last 7 days</h2>
                <Divider />
                {table_a}

                <h2>Top 10 highest rated users</h2>
                <Divider />
                {table_b}
            </Container>
        )
    }
}

const userListing = (users, firstCell, secondCell) => {

    console.log('in user listings: ', users.length)

    return (
        <Table>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>{firstCell}</Table.HeaderCell>
                    <Table.HeaderCell>{secondCell}</Table.HeaderCell>
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
                <Link to={`/users/${user.id}`}>{user.username}</Link>
            </Table.Cell>
            <Table.Cell>
                {user.value}
            </Table.Cell>
        </Table.Row>
    )
}


export default TopUsers