import React from 'react';
import users from '../services/users'
import { Message } from 'semantic-ui-react'

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

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        const request = users.login(user)

        request.then(res => {

            if (res.error) {

                console.log('Login failed', res)

                this.setState({
                    message: res.error
                })
            } else {

                console.log('Login was succesful', res)

                const user = res.user
                user.access_token = res.access_token
                user.refresh_token = res.refresh_token

                this.props.setCurrentUser(user)
                localStorage.setItem("user", JSON.stringify(user))

                this.setState({
                    username: '',
                    password: '',
                    message: `You are logged in as ${user.username}`
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

class RegisterForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            message: null
        }
    }

    register(event) {
        event.preventDefault()

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        const request = users.register(user)

        request.then(res => {

            console.log("res status: ", res.status)

            if (res.error) {

                console.log('Login failed', res)

                this.setState({
                    message: res.error
                })
            } else {

                console.log('Register was succesful', res)

                const user = res.user
                user.access_token = res.access_token
                user.refresh_token = res.refresh_token

                this.props.setCurrentUser(user)
                localStorage.setItem("user", JSON.stringify(user))

                this.setState({
                    username: '',
                    password: '',
                    message: `Registered as ${user.username}`
                })
            }
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
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Register</h2>

                    {message}

                    <form onSubmit={this.register.bind(this)}>
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

                        <button type="submit">Register</button>
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
const ConnectedRegisterForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterForm)

export default {
    LoginForm: ConnectedLoginForm,
    RegisterForm: ConnectedRegisterForm
}