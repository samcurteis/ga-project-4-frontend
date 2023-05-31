import { configureStore, combineReducers } from '@reduxjs/toolkit';
import currentAuthorReducer from '../features/authorPage/authorPageSlice.js'
import currentUserReducer from '../features/userPage/userPageSlice.js'
import currentPoemReducer from '../features/poemPage/poemPageSlice.js'
import currentPostReducer from '../features/postPage/postPageSlice.js'

const rootReducer = combineReducers({
        currentAuthor: currentAuthorReducer,
        currentUser: currentUserReducer,
        currentPoem: currentPoemReducer,
        currentPost: currentPostReducer
})

export default configureStore({
    reducer: rootReducer
});

export const setupStore = preloadedState => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}
