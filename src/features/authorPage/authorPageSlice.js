import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../lib/api.js'

console.log('heelo');

export const loadCurrentAuthor = createAsyncThunk(
    'currentAuthor/loadCurrentAuthor',
       async (authorId) => {
        try {
            const response = await API.GET(API.ENDPOINTS.singleAuthor(authorId));
            const data = response.data;
          console.log('from loadCurrentAuthor', data);
          return data;
      } catch(error) {
        console.error(error.message, error.response);
        console.log('error activated')
       }
    }
); 

export const currentAuthorSlice = createSlice({
    name: 'currentAuthor',
    initialState: {
        author: undefined,
        isLoadingCurrentAuthor: false,
        hasError: false
    },
    extraReducers: (builder) => {
    builder
      .addCase(loadCurrentAuthor.pending, (state) => {
        state.isLoadingCurrentAuthor = true;
        state.hasError = false;
        console.log('pending');
      })
      .addCase(loadCurrentAuthor.fulfilled, (state, action) => {
        state.isLoadingCurrentAuthor = false;
        state.hasError = false;
        state.author = action.payload;
        console.log('fulfilled');
      })
      .addCase(loadCurrentAuthor.rejected, (state) => {
        state.isLoadingCurrentAuthor = false;
        state.hasError = true;
        state.author = {};
        console.log('rejected');
      })
  }
});

export const selectCurrentAuthor = (state) => state.currentAuthor.author;
export const isLoadingCurrentAuthor = (state) => state.currentAuthor.isLoadingCurrentAuthor;

export default currentAuthorSlice.reducer;
