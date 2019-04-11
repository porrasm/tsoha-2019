import axios from 'axios'
const baseUrl = "/api/"

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    console.log('GET post: ', id)
    const response = await axios.get(baseUrl + "get/" + id)
    return response.data
}

const update = async (newUser) => {

    let response

    try {
        const config = {
            headers: { 'Authorization': getToken(newUser) }
        }

        console.log('Updating user: ', newUser)
        response = await axios.put(`${baseUrl}update/${newUser.id}`, newUser, config)

        console.log('Response: ', response)

        return response.data
    } catch (error) {
        console.log('Failed to update user', error)
        return error.response.data
    }
}

const login = async (user) => {
    try {
        const response = await axios.post(baseUrl + "login", user)
        return response.data
    } catch (error) {
        return error
    }
}

const register = async (user) => {
    try {
        const response = await axios.post(baseUrl + "register", user)
        return response.data
    } catch (error) {
        return error
    }
}

const getToken = (user) => {

    if (!user) {
        return 'Bearer empty'
    }

    const token = `Bearer ${user.access_token}`
    console.log("token: ", token)
    return token
}

export default { getAll, getOne, update, login, register }