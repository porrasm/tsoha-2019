import axios from 'axios'
const baseUrl = "/"

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    console.log('GET post: ', id)
    const response = await axios.get(baseUrl + "/get/" + id)
    return response.data
}

const login = async (user) => {
    const response = await axios.post(baseUrl + "login", user)
    return response.data
}

export default { getAll, getOne, login }