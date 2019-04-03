import React, { useState } from 'react';
import users from '../services/users'
import { Form, TextArea, Button, Message } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { setCurrentUser } from '../reducers/userReducer'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            message: null
        }
    }

    login(event) {
        event.preventDefault()

        console.log('Creating post')

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        const request = users.login(user)

        request.then(res => {

            if (!res) {

                console.log('Login failed', res)

                this.setState({
                    message: 'Incorrect username or password'
                })
            } else {

                console.log('Login was succesful', res)

                this.props.setCurrentUser(res.user)
                localStorage.setItem("user", JSON.stringify(res.user))

                this.setState({
                    username: '',
                    password: '',
                    message: `You are logged in as ${res.user.username}`
                })
            }
        })
    }

    logout() {
        localStorage.removeItem("user")
        this.props.setCurrentUser()
        this.setState({
            message: null
        })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {

        const message = this.state.message ? (<p>{this.state.message}</p>) : null
        const user = this.props.userContainer.current_user

        if (user) {
            return (
                <div>
                    <Message>
                        <p>You are logged in as {user.username}</p>
                    </Message>


                    <button onClick={this.logout.bind(this)}>
                        Sign out
                </button>
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Login</h2>

                    {message}

                    <form onSubmit={this.login.bind(this)}>
                        <div>
                            Username
                        <input
                                value={this.state.username}
                                name='username'
                                onChange={this.handleChange.bind(this)}
                            />
                        </div>
                        <div>
                            Password
                        <input
                                type='password'
                                value={this.state.password}
                                name='password'
                                onChange={this.handleChange.bind(this)}
                            />
                        </div>

                        <button type="submit">Login</button>
                    </form>
                </div>
            )
        }
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

const ConnectedLoginForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm)

export default ConnectedLoginForm