import React from "react";
import { Menu } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import MenuViews from './MenuViews'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import Post from './components/Post'
import LoginForm from "./components/LoginForm";
import AccountPage from './components/AccountPage'

import { connect } from 'react-redux'
import { setCurrentUser } from './reducers/userReducer'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const loggedUserJSON = window.localStorage.getItem('user')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            console.log("calling setCurrentUser: ", user)
            this.props.setCurrentUser(user)
        }
    }

    render() {

        console.log("REDUX PROPS: ", this.props)

        return (
            <div>

                <h1>Welcome to my React app!</h1>
                <p>
                    This is only a prototype!
                </p>

                <Router>
                    <div>
                        <MenuViews.Menus />

                        <Route exact path="/" render={() => <PostList />} />
                        <Route exact path="/posts/get/:id" component={Post} />
                        <Route exact path="/posts/new" render={() => <PostForm />} />
                        <Route exact path="/login" render={() => <LoginForm.LoginForm />} />
                        <Route exact path="/register" render={() => <LoginForm.RegisterForm />} />
                        <Route exact path="/account" render={() => <AccountPage />} />
                    </div>
                </Router>

            </div>
        );
    }
}

const mapStateToProps = (state) => {

    console.log('App mapState: ', state)

    return {
        userContainer: state.userContainer,
    }
}
const mapDispatchToProps = {
    setCurrentUser
}

const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default ConnectedApp