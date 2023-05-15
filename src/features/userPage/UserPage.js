import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AUTH } from '../../lib/auth';

import { Container, Box } from '@mui/material';

import CommonButton from '../../components/common/CommonButton';
import CommonTypography from '../../components/common/CommonTypography';
import ProfilePicture from '../../components/common/ProfilePicture';

import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser, selectCurrentUser, isLoadingCurrentUser } from './userPageSlice.js';

export default function UserPage({ setSinglePost, setSinglePoem }) {
  // const [isLoggedIn] = useAuthenticated();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const navigateToPost = (e) => navigate(`/posts/${e.target.id}`);
  const navigateToNewPost = (e) => {
    setSinglePost(null);
    navigate(`/new-post`);
  };
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);
  const navigateToAuthor = (e) => navigate(`/authors/${e.target.id}`);
  const navigateToUser = (e) => navigate(`/users/${e.target.id}`);
  const navigateToNewPoem = () => {
    setSinglePoem(null);
    navigate(`/new-poem`);
  };
  const { id } = useParams();
  
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currentUserIsLoading = useSelector(isLoadingCurrentUser);
  

  useEffect(() => {
      dispatch(loadCurrentUser(id));
          // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

    if (currentUserIsLoading) {
        return <h1>Loading</h1>
    } else if (!currentUser) {
        return null
    }

  return (
    <Container className='userpage Page'>
      <CommonButton onClick={goBack}>GO BACK</CommonButton>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap'
        }}
        className='userpage-items'
      >
        <Box
          name='first-section'
          sx={{
            width: '40vw',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box
              name='username-and-picture'
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                margin: 0,
                padding: '20px'
              }}
            >
              <ProfilePicture
                cloudinaryImageId={currentUser?.profile_image}
                size={100}
              />
              <h1>{currentUser?.username}</h1>
            </Box>
            {currentUser?.is_staff & AUTH.isOwner(+id) ? (
              <CommonButton onClick={navigateToNewPoem}>
                add new poem
              </CommonButton>
            ) : (
              <></>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {currentUser?.posts.length === 0 ? <></> : <h2>Posts</h2>}
            {currentUser?.posts?.map((post) => (
                <p
                  className='userpage post-title'
                  onClick={navigateToPost}
                  id={post.id}
                  key={post.id}
                >
                  {post.title}
                </p>
            ))}
            {AUTH.isOwner(+id) && (
              <CommonButton
                sx={{ paddingTop: '20px' }}
                onClick={navigateToNewPost}
              >
                WRITE A NEW POST
              </CommonButton>
            )}
          </Box>
        </Box>
        <Box
          name='second-section'
          sx={{
            marginTop: 10,
            width: '40vw',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            {currentUser?.poem_favorites.length === 0 ? (
              <></>
            ) : (
              <h2> Favourite poems</h2>
            )}
            {currentUser?.poem_favorites.map((poem) => (
              <>
                <p
                  className='poem-title'
                  onClick={navigateToPoem}
                  key={poem.name}
                  id={poem.id}
                >
                  {poem.title}
                </p>
                <CommonTypography
                  sx={{ paddingLeft: '5px' }}
                  onClick={navigateToAuthor}
                  id={poem.author.id}
                  key={poem.author.id}
                >
                  {poem.author.name}
                </CommonTypography>
              </>
            ))}
            {currentUser?.poem_favorites.length === 0 ? (
              <></>
            ) : (
              <h2> Favourite authors</h2>
            )}
            {currentUser?.favorite_authors.map((author) => (
              <CommonTypography
                sx={{ paddingLeft: '5px' }}
                onClick={navigateToAuthor}
                id={author.id}
                key={author.id}
              >
                {author.name}
              </CommonTypography>
            ))}
          </Box>
          <Box>
            {currentUser?.post_favorites.length === 0 ? (
              <></>
            ) : (
              <h2>Favourite posts</h2>
            )}

            {currentUser?.post_favorites.map((post, i) => (
              <div key={i}>
                <p
                  className='post-title'
                  onClick={navigateToPost}
                  key={i}
                  id={post.id}
                >
                  {post.title}
                </p>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: '20px'
                  }}
                  className='user-data'
                key={i}
                >
                  <ProfilePicture
                    cloudinaryImageId={post.author.profile_image}
                    key={i}
                  />
                  <CommonTypography
                    sx={{ fontSize: '18px' }}
                    onClick={navigateToUser}
                    id={post.author.id}
                    key={i}
                  >
                    {post.author.username}
                  </CommonTypography>
                </Box>
              </ div>
            ))}
          </Box>
        </Box>
      </Container>
    </Container>
  );
}
