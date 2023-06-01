import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AUTH } from '../../lib/auth';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useAuthenticated } from '../../hooks/useAuthenticated';

import { Container, Box, Typography } from '@mui/material';
import { IconContext } from 'react-icons';

import CommonTypography from '../../components/common/CommonTypography';
import CommonButton from '../../components/common/CommonButton';

import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentAuthor, selectCurrentAuthor, toggleFavoriteForAuthor, deleteCurrentAuthor } from './authorPageSlice.js';
import { loadCurrentUser, selectCurrentUser } from '../userPage/userPageSlice.js';

export default function AuthorPage() {
  const navigate = useNavigate();
  const [isLoggedIn] = useAuthenticated();
  const { id } = useParams();
  const currentUserId = AUTH.getPayload().sub;
  const goBack = () => navigate(-1);
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);

  const dispatch = useDispatch();
  const currentAuthor = useSelector(selectCurrentAuthor)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

   const toggleFavorite = (currentAuthor, currentUserId) => {
    const editedAuthor = {
      ...currentAuthor,
      author: currentAuthor.id,
      favorites: currentAuthor.favorites.includes(currentUserId)
        ? currentAuthor.favorites.filter((i) => i !== currentUserId)
        : [...currentAuthor.favorites, currentUserId]
    };
      return editedAuthor;
  };

  const editAuthor = () => {
      const editedAuthor = toggleFavorite(currentAuthor, currentUserId);
    dispatch(toggleFavoriteForAuthor({id, editedAuthor}))
  }


  const deleteAuthor = () => {
    dispatch(deleteCurrentAuthor(id));
        navigate(-1);
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
            onClick={editAuthor}
            name='post_favorites'
            aria-label='favorites'
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

