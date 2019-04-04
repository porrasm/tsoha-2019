import axios from 'axios'
const baseUrl = "/api/posts/comment"

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

export default { createComment, setUser }