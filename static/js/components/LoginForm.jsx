import React, { useState } from 'react';
import users from '../services/users'
import { Form, TextArea, Button } from 'semantic-ui-react'

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
                
                localStorage.setItem("user", JSON.stringify(res.user))

                this.setState({
                    username: '',
                    password: '',
                    message: `Succesfully logged in as ${res.user.username}`
                })
            }
        })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {

        const message = this.state.message ? (<p>{this.state.message}</p>) : null

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

export default LoginForm