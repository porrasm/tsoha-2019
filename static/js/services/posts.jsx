import axios from 'axios'
const baseUrl = "/posts"

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(baseUrl + "/" + id)
    return response.data
}

const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject)
    return response.data
}

export default { getAll, getOne, create }