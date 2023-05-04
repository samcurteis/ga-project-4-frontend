import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../lib/api.js'


export const loadCurrentAuthor = createAsyncThunk(
    'currentAuthor/loadCurrentAuthor',
       async (authorId) => {
        try {
            const response = await API.GET(API.ENDPOINTS.singleAuthor(authorId));
            const data = response.data;
          return data;
      } catch(error) {
        console.error(error.message, error.response);
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
      })
      .addCase(loadCurrentAuthor.fulfilled, (state, action) => {
        state.isLoadingCurrentAuthor = false;
        state.hasError = false;
        state.author = action.payload;
      })
      .addCase(loadCurrentAuthor.rejected, (state) => {
        state.isLoadingCurrentAuthor = false;
        state.hasError = true;
        state.author = {};
      })
  }
});

export const selectCurrentAuthor = (state) => state.currentAuthor.author;
export const isLoadingCurrentAuthor = (state) => state.currentAuthor.isLoadingCurrentAuthor;

export default currentAuthorSlice.reducer;
