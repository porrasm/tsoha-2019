import users from '../services/users'
import posts from '../services/posts'
import comments from '../services/comments'

const userReducer = (state = { current_user: null }, action) => {

    const newState = {
        current_user: state.current_user,
    }

    switch (action.type) {
        case 'user-set':
            newState.current_user = action.user
            return newState
        default:
            return state
    }
}
export const setCurrentUser = (user) => {

    console.log('Setting current user: ', user)

    posts.setUser(user)
    comments.setUser(user)

    return async (dispatch) => {
        dispatch({
            type: 'user-set',
            user: user
        })
    }
}

export default userReducer