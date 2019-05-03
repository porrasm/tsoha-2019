import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home'
import MenuViews from './MenuViews'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import Post from './components/Post'
import LoginForm from "./components/LoginForm";
import AccountPage from './components/AccountPage'
import TopUsers from './components/TopUsers'

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

                <h1>ReadIt Forum</h1>
                <p>
                    Welcome to ReadIt forums! Here you can create posts and talk to people about anything and everything!
                </p>

                <Router>
                    <div>
                        <MenuViews.Menus />

                        <Route exact path="/" render={() => <Home />} />
                        <Route exact path="/" render={() => <PostList />} />
                        <Route exact path="/posts/:id" component={Post} />
                        <Route exact path="/create" render={() => <PostForm user={this.props.userContainer.current_user} />} />
                        <Route exact path="/login" render={() => <LoginForm.LoginForm />} />
                        <Route exact path="/register" render={() => <LoginForm.RegisterForm />} />
                        <Route exact path="/account" render={() => <AccountPage user_id={this.props.userContainer.current_user ? this.props.userContainer.current_user.id : null} />} />
                        <Route exact path="/users/:user_id" component={AccountPage} />
                        <Route exact path="/top_users" render={() => <TopUsers />} />
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