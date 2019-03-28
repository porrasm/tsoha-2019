import React from "react";
import posts from '../services/posts'
import { Table, Message, Container, Divider } from 'semantic-ui-react'

class Post extends React.Component {
    constructor(props) {
        super(props)

        console.log('PROPS: ', this.props)

        const id = this.props.match.params.id

        this.state = {
            id: id,
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
                <Container textAlign='center'>
                <h2>{this.state.post.title}</h2>
                </Container>
                <Container textAlign='left'>
                    
                    <Divider />
                    <p>
                        {this.state.post.text}
                    </p>
                </Container>
            </div>
        )
    }
}

export default Post