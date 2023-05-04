import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../lib/api';
import { AUTH } from '../../lib/auth';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useAuthenticated } from '../../hooks/useAuthenticated';
import { NOTIFY } from '../../lib/notifications';

import { Container, Box, Typography } from '@mui/material';
import { IconContext } from 'react-icons';

import CommonTypography from '../../components/common/CommonTypography';
import CommonButton from '../../components/common/CommonButton';

import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentAuthor, selectCurrentAuthor, isLoadingCurrentAuthor } from './authorPageSlice.js';
import { loadCurrentUser, selectCurrentUser } from '../userPage/userPageSlice.js';

export default function AuthorPage() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);
  const { id } = useParams();
//  const [currentAuthor, setSingleAuthor] = useState(null);
  const currentUserId = AUTH.getPayload().sub;
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoggedIn] = useAuthenticated();

  const dispatch = useDispatch();
  const currentAuthor = useSelector(selectCurrentAuthor)
  const currentAuthorIsLoading = useSelector(isLoadingCurrentAuthor);
  
  const currentUser = useSelector(selectCurrentUser)

  function OrangeHeart() {
    return (
      <IconContext.Provider
        value={{
          color: '#ffa500',
          style: { display: 'flex', alignItems: 'center' }
        }}
      >
        <div>
          <AiFillHeart />
        </div>
      </IconContext.Provider>
    );
  }


  useEffect(() => {
      dispatch(loadCurrentAuthor(id));
      dispatch(loadCurrentUser(currentUserId));

      setIsUpdated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const toggleFavorite = () => {
    const data = {
      ...currentAuthor,
      author: currentAuthor.id,
      favorites: currentAuthor.favorites.includes(currentUserId)
        ? currentAuthor.favorites.filter((i) => i !== currentUserId)
        : [...currentAuthor.favorites, currentUserId]
    };

    API.PUT(API.ENDPOINTS.currentAuthor(id), data, API.getHeaders())
      .then(({ data }) => {
        setIsUpdated(true);
      })
      .catch((e) => console.log(e));
      setIsUpdated(true);
  };

  const deleteAuthor = () =>
    API.DELETE(API.ENDPOINTS.currentAuthor(id), API.getHeaders())
      .then(({ data }) => {
        NOTIFY.SUCCESS(`${currentAuthor.name} deleted`);
        console.log(data);
        navigate(-1);
      })
      .catch((e) => console.log(e));

  if (currentAuthorIsLoading) {
      return <h1>'Loading'</h1>
    } else if (!currentAuthor) {
        return null
    }

  return (
    <Container className='Page'>
      <CommonButton onClick={goBack}>GO BACK</CommonButton>
      {currentUser?.is_staff ? (
        <>
          <CommonButton onClick={deleteAuthor}>Delete author</CommonButton>
        </>
      ) : (
        <></>
      )}
      <Typography
        sx={{ fontSize: '30px', marginTop: '10px', marginBottom: '15px' }}
      >
        {currentAuthor?.name}
      </Typography>
      {isLoggedIn && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {currentAuthor?.favorites.includes(currentUserId) ? (
            <OrangeHeart />
          ) : (
            <AiOutlineHeart />
          )}
          <CommonButton
            sx={{ padding: '10px' }}
            onClick={toggleFavorite}
            name='post_favorites'
          >
            {currentAuthor?.favorites.length}{' '}
            {currentAuthor?.favorites.length === 1 ? 'favourite' : 'favourites'}
          </CommonButton>
        </Box>
      )}
      <p>Poems</p>
      {currentAuthor?.poems.map((poem) => (
        <CommonTypography
          className='poem-list'
          onClick={navigateToPoem}
          key={poem.id}
          id={poem.id}
        >
          {poem.title}
        </CommonTypography>
      ))}
    </Container>
  );
}
