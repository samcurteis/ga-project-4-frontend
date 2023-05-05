import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../lib/api.js'


export const loadCurrentUser = createAsyncThunk(
    'currentUser/loadCurrentUser',
       async (userId) => {
        try {
            const response = await API.GET(API.ENDPOINTS.singleUser(userId));
            const data = response.data;
            console.log(data);
          return data;
      } catch(error) {
        console.error(error.message, error.response);
       }
    }
); 

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        user: undefined,
        isLoadingCurrentUser: false,
        hasError: false
    },
    extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        state.isLoadingCurrentUser = true;
        state.hasError = false;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.isLoadingCurrentUser = false;
        state.hasError = false;
        state.user = action.payload;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.isLoadingCurrentUser = false;
        state.hasError = true;
        state.user = {};
      })
  }
});

export const selectCurrentUser = (state) => state.currentUser.user;
export const isLoadingCurrentUser = (state) => state.currentUser.isLoadingCurrentUser;

export default currentUserSlice.reducer;

