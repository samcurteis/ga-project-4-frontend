import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../lib/api.js'
import { NOTIFY } from '../../lib/notifications';


export const loadCurrentPost = createAsyncThunk(
    'currentPost/loadCurrentPost',
       async (postId) => {
        try {
            const response = await API.GET(API.ENDPOINTS.singlePost(postId));
            const data = response.data;
          return data;
      } catch(error) {
        console.error(error.message, error.response);
       }
    }
); 

export const toggleLikeOrFavoriteForPost = createAsyncThunk(
    'currentPost/toggleLikeOrFavoriteForPost',
    async ({id, editedPost}) => {
        try {
            const response = await API.PUT(API.ENDPOINTS.singlePost(id), editedPost, API.getHeaders());
            const data = response.data;
            return data;
            } catch (error) {
                console.error(error.message, error.response);
                throw(error);
            }
    }
)

export const deleteCurrentPost = createAsyncThunk(
    'currentPost/deletePost',
    async (id) => {
        try {
            await API.DELETE(API.ENDPOINTS.singlePost(id), API.getHeaders());
        } catch (error) {
            console.error(error.message, error.response);
            throw(error);
        }
    }
)

export const currentPostSlice = createSlice({
    name: 'currentPost',
    initialState: {
        post: undefined,
        isLoadingCurrentPost: false,
        hasError: false
    },
    extraReducers: (builder) => {
    builder
      .addCase(loadCurrentPost.pending, (state) => {
        state.isLoadingCurrentPost = true;
        state.hasError = false;
      })
      .addCase(loadCurrentPost.fulfilled, (state, action) => {
        state.isLoadingCurrentPost = false;
        state.hasError = false;
        state.post = action.payload;
      })
      .addCase(loadCurrentPost.rejected, (state) => {
        state.isLoadingCurrentPost = false;
        state.hasError = true;
        state.post = {};
      })
      .addCase(toggleLikeOrFavoriteForPost.fulfilled, (state, action) => {
          const payload = action.payload;
        state.isLoadingCurrentPost = false;
        state.hasError = false;
        state.post = {...state.post, post_likes: payload.post_likes, post_favorites: payload.post_favorites};
      })
      .addCase(deleteCurrentPost.fulfilled, (state) => {
        NOTIFY.SUCCESS(`${state.currentPost.title} deleted`);
          state.isLoadingCurrentPost = false;
          state.hasError = false;
          state.post = {};
      })
  }
});

export const selectCurrentPost = (state) => state.currentPost.post;
export const isLoadingCurrentPost = (state) => state.currentPost.isLoadingCurrentAuthor;

export default currentPostSlice.reducer;


