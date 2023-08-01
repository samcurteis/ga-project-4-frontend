import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../lib/api';

import { Box, Typography } from '@mui/material';
import CommonButton from './common/CommonButton';
import CommonTypography from './common/CommonTypography';
import ProfilePicture from './common/ProfilePicture';

import { MouseEvent } from 'react';

export default function Home() {

  interface popularAuthors {
    favorites: number[]
  }

  interface popularPoems {
    poem_favorites: number[]
  }

  interface popularPosts {
    post_favorites: number[]
  }

  interface Poem {
    title: string,
    author: {
      name: string,
      id: string
    }
    id: string
  }


  // const [poems, setPoems] = useState(null);
  const [randomPoem, setRandomPoem] = useState<Poem | null>(null);
  // const [posts, setPosts] = useState(null);
  const [popularAuthors, setPopularAuthors] = useState<popularAuthors[] | null>(null);
  const [popularPoems, setPopularPoems] = useState<popularPoems[] | null>(null);
  const [popularPosts, setPopularPosts] = useState<popularPosts[] | null>(null);
  const [recentPosts, setRecentPosts] = useState(null);
  // const [users, setUsers] = useState(null);
  const [isUpdated, setIsUpdated] = useState(true);
  const navigate = useNavigate();
  const navigateToAuthor = (e: React.MouseEvent<HTMLTextAreaElement>): void => navigate(`/authors/${e.currentTarget.id}`);
  const navigateToUser = (e: React.MouseEvent<HTMLTextAreaElement>): void => navigate(`/users/${e.currentTarget.id}`);
  const navigateToPoem = (e: React.MouseEvent<HTMLParagraphElement>): void => navigate(`/poems/${e.currentTarget.id}`);
  const navigateToPost = (e: React.MouseEvent<HTMLTextAreaElement>) => navigate(`/posts/${e.currentTarget.id}`);
  // const goBack = () => navigate(-1);

  const getRandomPoem = () => setIsUpdated(true);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singlePoem(Math.round(Math.random() * 15652)))
      .then(({ data }) => {
        setRandomPoem(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    setIsUpdated(false);


    API.GET(API.ENDPOINTS.popularAuthors).then(({ data }) => {
      const filterData = (data: popularAuthors[]): popularAuthors[] => {
        return data.filter((i: popularAuthors) => i.favorites.length > 0);
      }
      const filteredData = filterData(data)
      setPopularAuthors(filteredData);
    });

    API.GET(API.ENDPOINTS.popularPoems).then(({ data }) => {
      const filterData = (data: popularPoems[]): popularPoems[] => {
        return data.filter((i) => i.poem_favorites.length > 0);
      }
      const filteredData = filterData(data)
      setPopularPoems(filteredData);
    });

    API.GET(API.ENDPOINTS.allPosts).then(({ data }) => {
      const filterData = (data: popularPosts[]): popularPosts[] => {
        return data.filter((i) => i.post_favorites.length > 0);
      }
      const filteredData = filterData(data)
      setPopularPosts(filteredData);
    });

    API.GET(API.ENDPOINTS.recentPosts).then(({ data }) => {
      setRecentPosts(data);
    });
  }, [isUpdated]);

  const title = randomPoem?.title.split('\n').join('<br><br/>');

  interface CommonTypographyProps {
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    id?: string;
    // You can add more prop types as needed
  }

  return (
    <section className='home Page'>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          width: '100vw'
        }}
      >
        <h1>Welcome to Poet's Corner</h1>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          // alignItems: 'center',
          width: '70vw'
        }}
      >
        <Box className='random-poem'>
          <h2>Random poem</h2>
          <Box sx={{ paddingLeft: '20px' }}>
            <p
              className='poem-title'
              onClick={navigateToPoem}
              key={randomPoem?.id}
              id={randomPoem?.id}
            >{randomPoem?.title}</p>
            <CommonTypography
              onClick={navigateToAuthor}
              id={randomPoem?.author.id}
            >{randomPoem?.author.name}
            </CommonTypography>
            <CommonButton sx={{ padding: '20px' }} onClick={getRandomPoem}>
              get random poem
            </CommonButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Recent posts</h2>
          <Box
            sx={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingBottom: '50px'
            }}
          >
            {recentPosts?.map((post) => (
              <Box key={post.id} sx={{ mr: 10 }}>
                <p className='post-title' onClick={navigateToPost} id={post.id}>
                  {post.title}
                </p>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  className='user-data'
                >
                  <ProfilePicture
                    cloudinaryImageId={post.author.profile_image}
                  />
                  <CommonTypography
                    sx={{ fontSize: '18px' }}
                    onClick={navigateToUser}
                    id={post.author.id}
                  >
                    {post.author.username}
                  </CommonTypography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          name='popular-authors'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Popular authors</h2>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {popularAuthors?.map((author) => (
              <Box key={author.id} sx={{ padding: '20px', mr: 5 }}>
                <CommonTypography
                  sx={{ fontSize: '18px' }}
                  onClick={navigateToAuthor}
                  id={author.id}
                >
                  {author.name}
                </CommonTypography>
                <Typography>
                  {author.favorites.length}{' '}
                  {author.favorites.length === 1 ? 'favourite' : 'favourites'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          name='popular-poems'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Popular poems</h2>
          <Box
            sx={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}
          >
            {popularPoems?.map((poem) => {
              const popularPoemTitle = poem.title.split('\n').join('<br><br/>');
              return (
                <Box key={poem.id} sx={{ width: 200 }}>
                  <p
                    className='poem-title'
                    onClick={navigateToPoem}
                    key={poem?.id}
                    id={poem?.id}
                    dangerouslySetInnerHTML={{ __html: popularPoemTitle }}
                  ></p>
                  <CommonTypography
                    sx={{ fontSize: '18px' }}
                    onClick={navigateToAuthor}
                    id={poem.author.id}
                  >
                    {poem?.author.name}
                  </CommonTypography>
                  <Typography sx={{ padding: '20px' }}>
                    {poem.poem_favorites.length}{' '}
                    {poem.poem_favorites.length === 1
                      ? 'favourite'
                      : 'favourites'}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box
          name='popular-posts'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Popular posts</h2>
          <Box
            sx={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingBottom: '50px'
            }}
          >
            {popularPosts?.map((post) => (
              <Box key={post.id} sx={{ mr: 10 }}>
                <p className='post-title' onClick={navigateToPost} id={post.id}>
                  {post.title}
                </p>
                <Typography>
                  {post.post_favorites.length}{' '}
                  {post.post_favorites.length === 1
                    ? 'favourite'
                    : 'favourites'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  className='user-data'
                >
                  <ProfilePicture
                    cloudinaryImageId={post.author.profile_image}
                  />
                  <CommonTypography
                    sx={{ fontSize: '18px' }}
                    onClick={navigateToUser}
                    id={post.author.id}
                  >
                    {post.author.username}
                  </CommonTypography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </section>
  );
}
