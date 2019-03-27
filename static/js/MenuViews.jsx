import React from "react";
import { Menu } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const Menus = () => (
    <div>
        <Menu inverted>
            <Menu.Item link>
                <Link to="/">Posts</Link>
            </Menu.Item>
            <Menu.Item link>
                <Link to="/posts/new">Create new post</Link>
            </Menu.Item>
        </Menu>
    </div>
)

export default { Menus }