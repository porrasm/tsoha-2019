import React from "react";
import { Menu } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import MenuViews from './MenuViews'
import PostList from './components/PostList'
import PostForm from './components/PostForm'

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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
                        <Route exact path="/posts/:id" render={() => <Post id={this.props.match.params.id} />} />
                        <Route exact path="/posts/new" render={() => <PostForm />} />
                    </div>
                </Router>

            </div>
        );
    }
}
