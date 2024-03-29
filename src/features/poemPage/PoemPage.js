import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AUTH } from '../../lib/auth';
import CommonButton from '../../components/common/CommonButton';
import CommonTypography from '../../components/common/CommonTypography';
import { useAuthenticated } from '../../hooks/useAuthenticated';
import { IconContext } from 'react-icons';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';

import { Container, Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentPoem, toggleLikeOrFavoriteForPoem, selectCurrentPoem, deleteCurrentPoem } from './poemPageSlice.js'

import { loadCurrentUser, selectCurrentUser } from '../userPage/userPageSlice.js'

export default function PoemPage({ setSinglePoem }) {
  const [isLoggedIn] = useAuthenticated();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const navigateToAuthor = (e) => navigate(`/authors/${e.target.id}`);
  const navigateToNewPoem = () => navigate(`/new-poem`);
  const { id } = useParams();
  const currentUserId = AUTH.getPayload().sub;

  const dispatch = useDispatch();
  const singlePoem = useSelector(selectCurrentPoem);
  const currentUser = useSelector(selectCurrentUser);

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
  function OrangeThumbUp() {
    return (
      <IconContext.Provider
        value={{
          color: '#ffa500',
          style: { display: 'flex', alignItems: 'center' }
        }}
      >
        <div>
          <HiThumbUp />
        </div>
      </IconContext.Provider>
    );
  }

  useEffect(() => {
    dispatch(loadCurrentPoem(id));
    dispatch(loadCurrentUser(currentUserId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const addOrRemoveLikeOrFavorite = (data) => {
        const editedPoem = {...singlePoem, ...data}
      dispatch(toggleLikeOrFavoriteForPoem({id, editedPoem}));
  }


  const toggleLike = () => {
    const poemLikes = singlePoem.poem_likes
    const indexOfUser = poemLikes.indexOf(currentUserId);
    const poemLikesWithoutUser = [...poemLikes.slice(0, indexOfUser), ...poemLikes.slice(indexOfUser + 1)];
    const poemLikesWithUser = [...poemLikes, currentUserId]

    const newPoemLikes = singlePoem.poem_likes.includes(currentUserId)
      ? poemLikesWithoutUser
      : poemLikesWithUser

    const data = {
        author: singlePoem.author.id,
        poem_likes: newPoemLikes     
    }
      addOrRemoveLikeOrFavorite(data);
};

  const toggleFavorite = () => {
    const poemFavorites = singlePoem.poem_favorites
    const indexOfUser = poemFavorites.indexOf(currentUserId);
    const poemFavoritesWithoutUser = [...poemFavorites.slice(0, indexOfUser), ...poemFavorites.slice(indexOfUser + 1)];
    const poemFavoritesWithUser = [...poemFavorites, currentUserId]

    const newPoemFavorites= singlePoem.poem_favorites.includes(currentUserId)
      ? poemFavoritesWithoutUser
      : poemFavoritesWithUser

    const data = {
        author: singlePoem.author.id,
        poem_favorites: newPoemFavorites
    }
      addOrRemoveLikeOrFavorite(data);
  };

  const deletePoem = () => {
        dispatch(deleteCurrentPoem(id));
        navigate(-1);
  }

  const title = singlePoem?.title.split('\n').join('<br><br/>');
  const content = singlePoem?.content.split('\n').join('<br><br/>');

  return (
    <Container className='Page'>
      <CommonButton className='link' onClick={goBack}>
        GO BACK
      </CommonButton>
      {currentUser?.is_staff ? (
        <>
          <CommonButton onClick={navigateToNewPoem}>Edit poem</CommonButton>
          <CommonButton onClick={deletePoem}>Delete poem</CommonButton>
        </>
      ) : (
        <></>
      )}
      <p className='title' dangerouslySetInnerHTML={{ __html: title }}></p>
      <CommonTypography
        sx={{ fontSize: '18px' }}
        onClick={navigateToAuthor}
        id={singlePoem?.author.id}
      >
        {singlePoem?.author.name}
      </CommonTypography>
      {isLoggedIn && (
        <Box className='like-favourite'>
          {singlePoem?.poem_likes.includes(currentUserId) ? (
            <OrangeThumbUp />
          ) : (
            <HiOutlineThumbUp />
          )}
          <CommonButton
            sx={{ padding: '20px' }}
            onClick={toggleLike}
            name='post_likes'
            id='post_likes'
          >
            {singlePoem?.poem_likes.length}{' '}
            {singlePoem?.poem_likes.length === 1 ? 'like' : 'likes'}
          </CommonButton>
          {/* <Tooltip title={singlePoem?.post_favorites.map((favorite) => favorite.name)} /> */}
          {singlePoem?.poem_favorites.includes(currentUserId) ? (
            <OrangeHeart />
          ) : (
            <AiOutlineHeart />
          )}
          {/* </Tooltip> */}
          <CommonButton
            sx={{ padding: '10px' }}
            onClick={toggleFavorite}
            name='post_favorites'
          >
            {singlePoem?.poem_favorites.length}{' '}
            {singlePoem?.poem_favorites.length === 1
              ? 'favourite'
              : 'favourites'}
          </CommonButton>
        </Box>
      )}
      <p
        className='poem-content'
        dangerouslySetInnerHTML={{ __html: content }}
      ></p>
    </Container>
  );
}
