import React from "react";
import posts from '../services/posts'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Table, Message, Container, Divider, Header } from 'semantic-ui-react'
import users from '../services/users'
import { Redirect } from 'react-router-dom'
import UserInfo from './UserInfo'

import { connect } from 'react-redux'
import { setCurrentUser } from '../reducers/userReducer'


class AccountPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            message: null
        }
    }


    updateAccount(newUser) {

        console.log('updating account: ', newUser)

        const response = users.update(newUser)
        response.then(res => {
            if (res.user) {
                console.log('successs: ', res)

                const user = res.user.user
                user.access_token = res.user.access_token
                user.refresh_token = res.user.refresh_token

                this.props.setCurrentUser(user)
                localStorage.setItem("user", JSON.stringify(user))
            } else {
                console.log('fail: ', res)
            }

            if (res.message) {
                this.setState({ message: res.message })
            } else if (res.error) {
                this.setState({ message: res.error })
            }
        })
    }

    deleteAccount(event) {
        event.preventDefault()

        if (!window.confirm("Are you sure you wish to delete your account?")) {
            return
        }

        const req = users.deleteAccount(this.props.userContainer.current_user)
        req.then(res => {
            if (res) {
                localStorage.removeItem("user")
                this.props.setCurrentUser()
                window.location.reload()
            } else {
                this.setState({ message: "Failed to delete account" })
            }
        })
    }

    render() {

        const user = this.props.userContainer.current_user

        if (!user) {
            console.log("Redirecting to home")
            return <Redirect to='/' />
        }

        return (
            <div>

                <UserInfo user={user} />

                <Divider />

                <Container textAlign="left">
                    <EditAccount user={user} updateAccount={this.updateAccount.bind(this)} message={this.state.message} />
                    <button onClick={this.deleteAccount.bind(this)}>Delete account</button>
                </Container>

            </div>
        )
    }
}

class EditAccount extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            hidden: false,
            new_username: '',
            new_password: '',
            password: ''
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    submit(event) {
        event.preventDefault()

        const userClone = this.props.user

        if (!userClone) {
            console.log('User was null')
            return
        }

        if (this.state.new_username.length > 0) {
            userClone.username = this.state.new_username
        }

        if (this.state.new_password.length > 0) {
            userClone.password = this.state.password
        }

        userClone.password = this.state.password

        this.props.updateAccount(userClone)
    }


    render() {

        return (
            <div>
                <h2>Update account</h2>

                {this.props.message}

                <form onSubmit={this.submit.bind(this)}>
                    <div>
                        New username
                    <input
                            value={this.state.new_username}
                            name='new_username'
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    <div>
                        New password
                    <input
                            type='password'
                            value={this.state.new_password}
                            name='new_password'
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    <div>
                        Old password (must not be empty)
                            <input
                                type='password'
                                value={this.state.password}
                                name='password'
                                onChange={this.handleChange.bind(this)}
                            />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        userContainer: state.userContainer,
    }
}
const mapDispatchToProps = {
    setCurrentUser
}

const connectedAccountPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountPage)

export default connectedAccountPage