import axios from 'axios'
const baseUrl = "/api/posts"

let user

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    console.log('GET post: ', id)
    const response = await axios.get(baseUrl + "/get/" + id)
    return response.data
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

export default { getAll, getOne, create, setUser, like, dislike }