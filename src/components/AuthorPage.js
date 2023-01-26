import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
// import { useAuthenticated } from '../hooks/useAuthenticated';

import {
  Container,
  // Box,
  // CardActions,
  // CardContent,
  Typography
} from '@mui/material';

import CommonTypography from './common/CommonTypography';
import CommonButton from './common/CommonButton';

export default function AuthorPage() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);
  const { id } = useParams();
  const [singleAuthor, setSingleAuthor] = useState(null);
  const currentUserId = AUTH.getPayload().sub;
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleAuthor(id))
      .then(({ data }) => {
        setSingleAuthor(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
  }, [id, isUpdated]);

  const toggleFavorite = () => {
    console.log('toggle Favourite activated');
    const data = {
      ...singleAuthor,
      author: singleAuthor.id,
      favorites: singleAuthor.favorites.includes(currentUserId)
        ? singleAuthor.favorites.filter((i) => i !== currentUserId)
        : [...singleAuthor.favorites, currentUserId]
    };

    API.PUT(API.ENDPOINTS.singleAuthor(id), data, API.getHeaders())
      .then(({ data }) => {
        console.log('from put', data);
        setIsUpdated(true);
      })
      .catch((e) => console.log(e));
  };

  // useEffect(() => {

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [singleAuthor.favorites.length]);

  return (
    <Container className='Page'>
      <CommonButton onClick={goBack}>GO BACK</CommonButton>
      <Typography
        sx={{ fontSize: '30px', marginTop: '10px', marginBottom: '15px' }}
      >
        {singleAuthor?.name}
      </Typography>
      <CommonButton
        sx={{ padding: '10px' }}
        onClick={toggleFavorite}
        name='post_favorites'
      >
        {singleAuthor?.favorites.length}{' '}
        {singleAuthor?.favorites.length === 1 ? 'favourite' : 'favourites'}
      </CommonButton>
      {singleAuthor?.poems.map((poem) => (
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
