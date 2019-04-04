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

    const response = await axios.post(baseUrl + "/create", newObject)
    return response.data
}

const setUser = (newUser) => {
    user = newUser
}

export default { getAll, getOne, create }