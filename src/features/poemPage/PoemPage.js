import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../lib/api';
import { AUTH } from '../../lib/auth';
import CommonButton from '../../components/common/CommonButton';
import CommonTypography from '../../components/common/CommonTypography';
import { useAuthenticated } from '../../hooks/useAuthenticated';
import { NOTIFY } from '../../lib/notifications';
import { IconContext } from 'react-icons';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';

import { Container, Box } from '@mui/material';

export default function PoemPage({ singlePoem, setSinglePoem }) {
  const [isLoggedIn] = useAuthenticated();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const navigateToAuthor = (e) => navigate(`/authors/${e.target.id}`);
  const navigateToNewPoem = () => navigate(`/new-poem`);
  const { id } = useParams();
  const [updateData, setUpdateData] = useState(false);
  const currentUserId = AUTH.getPayload().sub;
  const [currentUser, setCurrentUser] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

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
    API.GET(API.ENDPOINTS.singlePoem(id))
      .then(({ data }) => {
        setSinglePoem(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    API.GET(API.ENDPOINTS.singleUser(currentUserId))
      .then(({ data }) => {
        setCurrentUser(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isUpdated]);

  const addOrRemoveLikeOrFavorite = (data) => {
      API.PUT(
      API.ENDPOINTS.singlePoem(id),
      { ...singlePoem, ...data},
      API.getHeaders()
    )
      .then(({ data }) => {
          setSinglePoem({...singlePoem, poem_likes: data.poem_likes, poem_favorites: data.poem_favorites});
      })
      .catch((e) => console.log(e));
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

  const deletePoem = () =>
    API.DELETE(API.ENDPOINTS.singlePoem(id), API.getHeaders())
      .then(({ data }) => {
        NOTIFY.SUCCESS(`${singlePoem.title} deleted`);
        navigate(-1);
      })
      .catch((e) => console.log(e));

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
