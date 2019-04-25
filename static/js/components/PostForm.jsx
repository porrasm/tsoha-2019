import React, { useState } from 'react';
import posts from '../services/posts'
import { Form, TextArea, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

class PostForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            created_id: null,
            title: '',
            text: ''
        }
    }  

    createPost(event) {
        event.preventDefault()

        console.log('Creating post')

        const post = {
            title: this.state.title,
            text: this.state.text
        }

        const request = posts.create(post)

        request.then(res => {

            console.log('Post create response: ', res)

            this.setState({
                created_id: res.id,
                title: '',
                text: ''
            })       
        })


    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {

        if (!this.props.user) {
            console.log("Redirecting to home")
            return <Redirect to='/login' />
        }
        if (this.state.created_id) {
            const url = '/posts/' + this.state.created_id
            return <Redirect to={url} />
        }

        return (
            <div>
                <h2>Create post</h2>

                <form onSubmit={this.createPost.bind(this)}>
                    Title
                    <div>                    
                        <textarea
                            value={this.state.title}
                            name='title'
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    Text
                    <div> 
                        <textarea
                            value={this.state.text}
                            name='text'
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>

                    <button type="submit">Create post</button>
                </form>
            </div>
        )
    }

    /* renderOld() {
         return (
             <div>
                 <h2>Create post</h2>
 
                 <form onSubmit={this.createPost.bind(this)}>
                     <div>
                         Title
                         <input
                             value={this.state.title}
                             name='title'
                             onChange={this.handleChange.bind(this)}
                         />
                     </div>
                     <div>
                         Text
                         <input
                             value={this.state.text}
                             name='text'
                             onChange={this.handleChange.bind(this)}
                         />
                     </div>
 
                     <button type="submit">Create post</button>
                 </form>
             </div>
         )
     }
 
     */
}

export default PostForm