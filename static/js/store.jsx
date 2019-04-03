import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
    userContainer: userReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store