import users from '../services/users'

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

    return async (dispatch) => {
        dispatch({
            type: 'user-set',
            user: user
        })
    }
}

export default userReducer