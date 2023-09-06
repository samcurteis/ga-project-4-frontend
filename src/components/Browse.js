import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../lib/api';

import { Container, Grid, Typography, Box } from '@mui/material';
import CommonButton from './common/CommonButton';
import CommonTypography from './common/CommonTypography';

export default function Browse({ searchedData, setIsUpdated, isUpdated }) {
  const [poems, setPoems] = useState(null);
  const [posts, setPosts] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [users, setUsers] = useState(null);
  const [isPoemsPageOpen, setIsPoemsPageOpen] = useState(false);
  const [isPostsPageOpen, setIsPostsPageOpen] = useState(false);
  const [isAuthorsPageOpen, setIsAuthorsPageOpen] = useState(false);
  const [isUsersPageOpen, setIsUsersPageOpen] = useState(false);

  const navigate = useNavigate();
  const navigateToAuthor = (e) => navigate(`/authors/${e.target.id}`);
  const navigateToUser = (e) => navigate(`/users/${e.target.id}`);
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);
  const navigateToPost = (e) => navigate(`/posts/${e.target.id}`);
  const goBack = () => navigate(-1);

  const openPoemsPage = () => {
    setIsPoemsPageOpen(true);
    setIsAuthorsPageOpen(false);
    setIsUsersPageOpen(false);
    setIsPostsPageOpen(false);
  };
  const openPostsPage = () => {
    setIsPoemsPageOpen(false);
    setIsPostsPageOpen(true);
    setIsAuthorsPageOpen(false);
    setIsUsersPageOpen(false);
  };
  const openAuthorsPage = () => {
    setIsPoemsPageOpen(false);
    setIsUsersPageOpen(false);
    setIsAuthorsPageOpen(true);
    setIsPostsPageOpen(false);
    getData();
  };
  const openUsersPage = () => {
    setIsPoemsPageOpen(false);
    setIsPostsPageOpen(false);
    setIsAuthorsPageOpen(false);
    setIsUsersPageOpen(true);
    getData();
  };

  const getData = (e) => {
    if (isPoemsPageOpen) {
      API.GET(API.ENDPOINTS.poemIndex(e.target.name))
        .then(({ data }) => {
          console.log(data);
          setPoems(data);
        })
        .catch(({ message, response }) => {
          console.error(message, response);
        });
    }

    if (isPostsPageOpen) {
      API.GET(API.ENDPOINTS.allPosts)
        .then(({ data }) => {
          setPosts(data);
          console.log(data);
        })
        .catch(({ message, response }) => {
          console.error(message, response);
        });
    }

    if (isAuthorsPageOpen) {
      API.GET(API.ENDPOINTS.authorIndex(e.target.name))
        .then(({ data }) => {
          setAuthors(data);
          console.log(data);
        })
        .catch(({ message, response }) => {
          console.error(message, response);
        });
    }

    if (isUsersPageOpen) {
      API.GET(API.ENDPOINTS.allUsers)
        .then(({ data }) => {
          setUsers(data);
          console.log(data);
        })
        .catch(({ message, response }) => {
          console.error(message, response);
        });
    }
  };

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetArray = alphabet.split('');

  return (
    <Container className='Page'>
      <CommonButton onClick={openPoemsPage}>Poems</CommonButton>
      <CommonButton onClick={openAuthorsPage}>Authors</CommonButton>
      <CommonButton onClick={openPostsPage}>Posts</CommonButton>
      <CommonButton onClick={openUsersPage}>Users</CommonButton>

      <CommonButton onClick={goBack}>GO BACK</CommonButton>
      {isPoemsPageOpen || isAuthorsPageOpen ? (
        <Box name='alphabet'>
          <Typography sx={{ padding: '20px' }}>Choose a letter</Typography>
          {alphabetArray.map((letter) => (
            <CommonButton key={letter} name={letter} onClick={getData}>
                {letter}
            </CommonButton>
        ))}
        </Box>
      ) : (
        <></>
      )}

      <Grid
        sx={{ display: 'flex', flexDirection: 'column' }}
        container
        spacing={2}
      >
        {!isPoemsPageOpen &&
          !isAuthorsPageOpen &&
          !isPostsPageOpen &&
          !isUsersPageOpen && (
            <Typography sx={{ padding: '20px' }}>Choose a category</Typography>
          )}
        {isPoemsPageOpen ? (
          poems?.length === 0 ? (
            <Typography sx={{ padding: '20px' }}>No poems found</Typography>
          ) : (
            <>
              <Typography sx={{ fontSize: '25px', padding: '20px' }}>
                Poems
              </Typography>

              <Box
                sx={{
                  width: '70vw',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                {poems?.map((poem) => {
                  const title = poem.title.split('\n').join('<br><br/>');
                  console.log(poem);
                  return (
                    <Box
                      sx={{
                        width: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        paddingLeft: '20px',
                        paddingRight: '20px'
                      }}
                    >
                      <p
                        className='poem-title'
                        onClick={navigateToPoem}
                        key={poem.id}
                        id={poem.id}
                        dangerouslySetInnerHTML={{ __html: title }}
                      ></p>
                      <CommonTypography
                        onClick={navigateToAuthor}
                        id={poem.author.id}
                        key={poem.author.id}
                      >
                        {poem.author.name}
                      </CommonTypography>
                    </Box>
                  );
                })}
              </Box>
            </>
          )
        ) : (
          <></>
        )}
        {isUsersPageOpen ? (
          users?.length === 0 ? (
            <Typography>No users found</Typography>
          ) : (
            <>
              <Typography sx={{ fontSize: '25px', padding: '20px' }}>
                Users
              </Typography>
              <Box sx={{ width: 200, display: 'flex', flexDirection: 'row' }}>
                {users?.map((user) => (
                  <CommonTypography
                    onClick={navigateToUser}
                    id={user.id}
                    key={user.username}
                    sx={{ padding: '20px' }}
                  >
                    {user.username}
                  </CommonTypography>
                ))}
              </Box>
            </>
          )
        ) : (
          <></>
        )}
        {isAuthorsPageOpen ? (
          authors?.length === 0 ? (
            <></>
          ) : (
            <>
              <Typography sx={{ fontSize: '25px', padding: '20px' }}>
                Authors
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                {authors?.map((author) => (
                  <CommonTypography
                    onClick={navigateToAuthor}
                    id={author.id}
                    key={author.id}
                    sx={{ fontSize: '17px', padding: '20px' }}
                  >
                    {author.name}
                  </CommonTypography>
                ))}
              </Box>
            </>
          )
        ) : (
          <></>
        )}

        {isPostsPageOpen ? (
          posts?.length === 0 ? (
            <Typography>No posts</Typography>
          ) : (
            <>
              <Typography
                key='posts'
                sx={{ fontSize: '25px', padding: '20px' }}
              >
                Posts
              </Typography>

              <Box
                sx={{
                  width: '70vw',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: '80px'
                }}
              >
                {posts?.map((post) => {
                  return (
                    <Box
                      sx={{
                        width: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        paddingLeft: '20px',
                        paddingRight: '20px'
                      }}
                      key={post.id}
                    >
                      <p
                        className='post-title'
                        onClick={navigateToPost}
                        id={post.id}
                        key={post.title}
                        // sx={{ fontSize: '18px', fontWeight: 'bold' }}
                      >
                        {post.title}
                      </p>
                      <CommonTypography
                        onClick={navigateToUser}
                        id={post.author.id}
                        key={post.author.id}
                      >
                        {post.author.username}
                      </CommonTypography>
                    </Box>
                  );
                })}
              </Box>
            </>
          )
        ) : (
          <></>
        )}
      </Grid>
    </Container>
  );
}
