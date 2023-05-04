import { configureStore } from '@reduxjs/toolkit';
import currentAuthorReducer from '../features/authorPage/authorPageSlice.js'

export default configureStore({
    reducer: {
        currentAuthor: currentAuthorReducer
    },
});
