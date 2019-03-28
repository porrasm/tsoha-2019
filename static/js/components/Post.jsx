import React from "react";
import { Table, Message, Container, Divider } from 'semantic-ui-react'

class Post extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: props.id,
            post: null
        }
    }

    componentDidMount() {

        const request = posts.getOne(this.state.id)

        request.then(response => {
            this.setState({ post: response })
        })
    }

    render() {

        if (!this.state.post) {
            return(
                <div>Loading...</div>
            )
        }

        return (
            <div>
                <Container textAlign='left'>Left Aligned</Container>
                <Container textAlign='center'>Center Aligned</Container>
                <Container textAlign='right'>Right Aligned</Container>
                <Container textAlign='justified'>
                    <b>{this.state.post.title}</b>
                    <Divider />
                    <p>
                        {this.state.post.text}
                    </p>
                </Container>
            </div>
        )
    }
}