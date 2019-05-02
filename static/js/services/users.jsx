import axios from 'axios'
const baseUrl = "/api/"

let login_user

const setUser = (newUser) => {
    login_user = newUser
}

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

const getUserInfo = async (user) => {

    console.log('Getting user info method: ', user)

    if (!user) {
        return {}
    }

    const id = user.id ? user.id : user

    const config = {
        headers: { 'Authorization': getToken() }
    }

    try {
        const response = await axios.get(baseUrl + "account/" + id, config)
        return response.data
    } catch (error) {
        return error
    }
}

const deleteAccount = async (user) => {

    const config = {
        headers: { 'Authorization': getToken(user) }
    }

    try {
        const response = await axios.delete(baseUrl + "account", config)
        return true
    } catch (error) {
        return false
    }
}

const getToken = (user) => {

    if (!user) {
        if (!login_user) {
            return 'Bearer empty'
        }
        return getToken(login_user)
    }

    const token = `Bearer ${user.access_token}`
    console.log("token: ", token)
    return token
}

const getActiveUsers = async () => {

    console.log('Getting active users')

    try {
        const response = await axios.get(baseUrl + "users/active")
        return response.data
    } catch (error) {
        return []
    }
}

export default { setUser, getAll, getOne, getUserInfo, update, login, register, deleteAccount, getActiveUsers }