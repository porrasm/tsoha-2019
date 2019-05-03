import React from "react";
import { Container, Label } from 'semantic-ui-react'
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