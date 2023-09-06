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

export const toggleFavoriteForAuthor = createAsyncThunk(
    'currentAuthor/toggleFavoriteForAuthor',
    async ({id, editedAuthor}) => {
        try {
            const response = await API.PUT(API.ENDPOINTS.singleAuthor(id), editedAuthor, API.getHeaders());
            const data = response.data;
            return data;
            } catch (error) {
                console.error(error.message, error.response);
                throw(error);
            }
    }
)

export const deleteCurrentAuthor = createAsyncThunk(
    'currentAuthor/deleteAuthor',
    async (id) => {
        try {
            await API.DELETE(API.ENDPOINTS.singleAuthor(id), API.getHeaders());
        } catch (error) {
            console.error(error.message, error.response);
            throw(error);
        }
    }
)


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
      .addCase(toggleFavoriteForAuthor.fulfilled, (state, action) => {
          const payload = action.payload;
        state.isLoadingCurrentAuthor = false;
        state.hasError = false;
        state.author = {...state.author, favorites: payload.favorites};
      })
      .addCase(deleteCurrentAuthor.fulfilled, (state) => {
          state.isLoadingCurrentAuthor = false;
          state.hasError = false;
          state.author = {};
      })
      .addCase(deleteCurrentAuthor.rejected, (state) => {
          state.isLoadingCurrentAuthor = false;
          state.hasError = true;
      })


  }
});

export const selectCurrentAuthor = (state) => state.currentAuthor.author;
export const isLoadingCurrentAuthor = (state) => state.currentAuthor.isLoadingCurrentAuthor;
export const currentAuthorHasError = (state) => state.currentAuthor.hasError;

export default currentAuthorSlice.reducer;
