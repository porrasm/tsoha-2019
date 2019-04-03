import axios from 'axios'
const baseUrl = "/api/"

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
    try {
        const response = await axios.post(baseUrl + "login", user)
        return response.data
    } catch (error) {
        return error
    }
}

export default { getAll, getOne, login }