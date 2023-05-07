import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../lib/api.js'


export const loadCurrentPoem = createAsyncThunk(
    'currentPoem/loadCurrentPoem',
       async (poemId) => {
        try {
            const response = await API.GET(API.ENDPOINTS.singlePoem(poemId));
            const data = response.data;
          return data;
      } catch(error) {
        console.error(error.message, error.response);
       }
    }
); 

export const toggleLikeOrFavoriteForPoem = createAsyncThunk(
    'currentPoem/toggleLikeOrFavoriteForPoem',
    async ({id, editedPoem}) => {
        try {
            const response = await API.PUT(API.ENDPOINTS.singlePoem(id), editedPoem, API.getHeaders());
            const data = response.data;
            return data;
            } catch (error) {
                console.error(error.message, error.response);
                throw(error);
            }
    }
)

export const deleteCurrentPoem = createAsyncThunk(
    'currentPoem/deletePoem',
    async (id) => {
        try {
            await API.DELETE(API.ENDPOINTS.singlePoem(id), API.getHeaders());
        } catch (error) {
            console.error(error.message, error.response);
            throw(error);
        }
    }
)

export const currentPoemSlice = createSlice({
    name: 'currentPoem',
    initialState: {
        poem: undefined,
        isLoadingCurrentPoem: false,
        hasError: false
    },
    extraReducers: (builder) => {
    builder
      .addCase(loadCurrentPoem.pending, (state) => {
        state.isLoadingCurrentPoem = true;
        state.hasError = false;
      })
      .addCase(loadCurrentPoem.fulfilled, (state, action) => {
        state.isLoadingCurrentPoem = false;
        state.hasError = false;
        state.poem = action.payload;
      })
      .addCase(loadCurrentPoem.rejected, (state) => {
        state.isLoadingCurrentPoem = false;
        state.hasError = true;
        state.poem = {};
      })
      .addCase(toggleLikeOrFavoriteForPoem.fulfilled, (state, action) => {
          const payload = action.payload;
        state.isLoadingCurrentPoem = false;
        state.hasError = false;
        state.poem = {...state.poem, poem_likes: payload.poem_likes, poem_favorites: payload.poem_favorites};
      })
      .addCase(deleteCurrentPoem.fulfilled, (state) => {
          state.isLoadingCurrentPoem = false;
          state.hasError = false;
          state.poem = {};
      })
  }
});

export const selectCurrentPoem = (state) => state.currentPoem.poem;
export const isLoadingCurrentPoem = (state) => state.currentPoem.isLoadingCurrentAuthor;

export default currentPoemSlice.reducer;

