import React from "react";
import { Menu } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { setCurrentUser } from './reducers/userReducer'

import userReducer from './reducers/userReducer'

class Menus extends React.Component {

    logout() {
        if (window.confirm("Are you sure you want to sign out?")) {
            localStorage.removeItem("user")
            this.props.setCurrentUser()
        }
    }

    render() {

        const user = this.props.userContainer.current_user

        const userButton = user ?
            (<Menu.Item onClick={this.logout.bind(this)}>
                Sign out
        </Menu.Item>) :
            (<Menu.Item link>
                <Link to="/login">Login</Link>
            </Menu.Item>)

        const registerButton = user ? null :
            (<Menu.Item link>
                <Link to="/register">Register</Link>
            </Menu.Item>)

        return (
            <div>
                <Menu inverted>

                    <Menu.Item link>
                        <Link to="/posts/new">Create new post</Link>
                    </Menu.Item>

                    <Menu.Item link>
                        <Link to="/">Posts</Link>
                    </Menu.Item>

                    {userButton}
                    {registerButton}
                </Menu>
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

const ConnectedMenus = connect(
    mapStateToProps,
    mapDispatchToProps
)(Menus)

export default { Menus: ConnectedMenus }