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
  }
});

export const selectCurrentPoem = (state) => state.currentPoem.poem;
export const isLoadingCurrentPoem = (state) => state.currentPoem.isLoadingCurrentAuthor;

export default currentPoemSlice.reducer;

