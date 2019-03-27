import axios from 'axios'
const baseurl = "/posts"

const getAll = async () => {
    const response = await axios.get(baseurl)
    return response.data
}

export default { getAll }