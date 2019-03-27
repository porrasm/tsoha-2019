import React from "react";
// import Hello from "./Hello";
// import { PageHeader } from "react-bootstrap";

// require('../css/fullstack.css');
// var $ = require('jquery');

import PostList from './components/PostList'

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <h1>Welcome to my React app!</h1>
                <p>
                    This is only a prototype
                </p>

                <PostList />

            </div>
        );
    }
}
