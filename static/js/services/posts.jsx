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

    const config = {
        headers: { 'Authorization': getToken() }
    }

    const response = await axios.post(baseUrl + "/create", newObject, config)
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

export default { getAll, getOne, create, setUser }