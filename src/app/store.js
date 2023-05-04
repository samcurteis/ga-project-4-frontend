import { configureStore } from '@reduxjs/toolkit';
import currentAuthorReducer from '../features/authorPage/authorPageSlice.js'
import currentUserReducer from '../features/userPage/userPageSlice.js'

export default configureStore({
    reducer: {
        currentAuthor: currentAuthorReducer,
        currentUser: currentUserReducer
    },
});
