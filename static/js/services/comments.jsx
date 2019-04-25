import axios from 'axios'
const baseUrl = "/api/posts/comments"

let user

const createComment = async (comment, post_id, comment_id) => {

    const comment_id_fixed = comment_id ? comment_id : -1

    const config = {
        headers: { 'Authorization': getToken() }
    }

    const response = await axios.post(`${baseUrl}/${post_id}/${comment_id_fixed}`, {comment: comment}, config)
    return response.data
}

const setUser = (newUser) => {
    user = newUser
}
const getToken = () => {

    if (!user) {
        return 'Bearer empty'
    }

    const token = `Bearer ${user.access_token}`
    console.log("token: ", token)
    return token
}

const like = async (id) => {

    const config = {
        headers: { 'Authorization': getToken() }
    }

    try {
        const response = await axios.get(baseUrl + "/like/" + id, config)
        return response.data
    } catch (error) {
        console.log('Error liking post: ', error)
    }
}
const dislike = async (id) => {

    const config = {
        headers: { 'Authorization': getToken() }
    }

    try {
        const response = await axios.get(baseUrl + "/dislike/" + id, config)
        return response.data
    } catch (error) {
        console.log('Error disliking post: ', error)
    }
}
const deleteFunction = async (id) => {

    const config = {
        headers: { 'Authorization': getToken() }
    }

    try {
        const response = await axios.delete(baseUrl + "/delete/" + id, config)
        return response.data
    } catch (error) {
        console.log('Error disliking post: ', error)
    }
}

export default { createComment, setUser, like, dislike, delete: deleteFunction }