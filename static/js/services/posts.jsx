import axios from 'axios'
const baseUrl = "/api/posts"

let user

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    console.log('GET post: ', id)
    const response = await axios.get(baseUrl + "/" + id)
    return response.data
}
const getByUserID = async (user_id) => {

    console.log('Getting posts by user: ', user_id)

    try {
        const response = await axios.get(baseUrl + "/by/" + user_id)
        return response.data
    } catch (error) {
        console.log('Error liking post: ', error)
    }
}

const create = async (newObject) => {
    const response = await axios.post(baseUrl + "/create", newObject, config())
    return response.data
}

const setUser = (newUser) => {
    user = newUser
}
const config = () => {
    return {
        headers: { 'Authorization': getToken() }
    }
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
    try {
        const response = await axios.get(baseUrl + "/like/" + id, config())
        return response.data
    } catch (error) {
        console.log('Error liking post: ', error)
    }
}
const dislike = async (id) => {
    try {
        const response = await axios.get(baseUrl + "/dislike/" + id, config())
        return response.data
    } catch (error) {
        console.log('Error disliking post: ', error)
    }
}
const deletePost = async (id) => {
    try {   
        const response = await axios.delete(baseUrl + "/" + id, config())
        return response.data
    } catch(error) {
        console.log('Error deleting post')
        return false
    }
}

export default { getAll, getOne, getByUserID, create, setUser, like, dislike, deletePost }