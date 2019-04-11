import React from "react";
import posts from '../services/posts'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { Table, Message, Container, Divider, Header } from 'semantic-ui-react'
import users from '../services/users'

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
                this.setState({message: res.message})
            } else if (res.error) {
                this.setState({message: res.error})
            }
        })
    }

    render() {
        return (
            <EditAccount user={this.props.userContainer.current_user} updateAccount={this.updateAccount.bind(this)} message={this.state.message} />
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