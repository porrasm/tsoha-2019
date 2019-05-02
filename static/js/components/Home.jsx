import React from "react";
import posts from '../services/posts'
import { Table, Message, Container, Divider, Comment, Form, Label } from 'semantic-ui-react'
import comments from '../services/comments'
import { Link } from 'react-router-dom'

class Home extends React.Component {
    render() {


        return (
            <div>
                <Container>
                    <br />
                    <Label><Link to="/account">My account</Link></Label>
                    <Label><Link to="/top_users">Top users</Link></Label>
                </Container>
            </div>
        )
    }
}

export default Home