import axios from 'axios';
import { AUTH } from './auth';

const ENDPOINTS = {
  popularPoems: `/api/poems/`,
  poemIndex: (query) => `/api/poems/poem-index/?search=${query}`,
  singlePoem: (id) => `/api/poems/${id}/`,
  searchPoemTitles: (query) => `/api/poems/search-titles?search=${query}`,
  searchPoemContent: (query) => `/api/poems/search-content?search=${query}`,
  allAuthors: `/api/authors/`,
  popularAuthors: `/api/authors/popular/`,
  authorIndex: (query) => `/api/authors/index/?search=${query}`,
  singleAuthor: (id) => `/api/authors/${id}/`,
  searchAuthors: (query) => `/api/authors/search?search=${query}`,
  allPosts: '/api/posts/',
  recentPosts: '/api/posts/recent/',
  singlePost: (id) => `/api/posts/${id}/`,
  searchPosts: (query) => `/api/posts/search?search=${query}`,
  allComments: '/api/comments/',
  singleComment: (id) => `/api/comments/${id}/`,
  allUsers: '/api/auth/',
  singleUser: (id) => `/api/auth/${id}/`,
  searchUsers: (query) => `/api/auth/search?search=${query}`,
  login: '/api/auth/login/',
  register: 'api/auth/register/',
  cloudinary: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`
};

const getHeaders = () => ({
  headers: {
    authorization: `Bearer ${AUTH.getToken()}`
  }
});

const GET = (endpoint) => axios.get(endpoint);

const POST = (endpoint, body, headers) =>
  headers ? axios.post(endpoint, body, headers) : axios.post(endpoint, body);
const PUT = (endpoint, body, headers) => axios.put(endpoint, body, headers);
const DELETE = (endpoint, headers) => axios.delete(endpoint, headers);

export const API = { GET, POST, PUT, DELETE, ENDPOINTS, getHeaders };
