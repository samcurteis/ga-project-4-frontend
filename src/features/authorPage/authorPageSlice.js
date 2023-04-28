import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const loadSingleAuthor = createAsyncThumk(
    'singleAuthor/loadSingleAuthor',
       API.GET(API.ENDPOINTS.singleAuthor(id))
      .then(({ data }) => {
        setSingleAuthor(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
); 

export const singleAuthorSlice = createSlice({
    name: 'singleAuthor',
    initialState: {
        id: null,
        poems: [],
        name: '',
        favorites: []
    }
});

export const selectSingleAuthor = (state) => state.singleAuthor;

export default singleAuthorSlice.reducer;
