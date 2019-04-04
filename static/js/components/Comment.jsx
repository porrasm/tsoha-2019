import React from "react";
import posts from '../services/posts'
import { Table, Message, Container, Divider } from 'semantic-ui-react'

class Comment extends React.Component {

    render() {

        const comment = this.props.comment

        if (!comment) {
            return null
        }

        return(
            <div>
                <Message>
                    <p>{comment.text}</p>
                </Message>
            </div>
        )
    }
}

export default Comment