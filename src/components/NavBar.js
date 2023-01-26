import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, TextField } from '@mui/material';

import { AUTH } from '../lib/auth';
import { API } from '../lib/api';
import { useAuthenticated } from '../hooks/useAuthenticated';
import ProfilePicture from './common/ProfilePicture';
import CommonTypography from './common/CommonTypography';
import CommonButton from './common/CommonButton';

export default function Navbar({ setSearchedData, setIsUpdated }) {
  const navigate = useNavigate();
  const navigateToProfile = () => navigate(`/users/${AUTH.getPayload().sub}`);
  const navigateToRegister = () => navigate(`/register`);
  const navigateToLogin = () => navigate(`/login`);
  const navigateToHome = () => navigate(`/`);
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useAuthenticated();
  const [currentUser, setCurrentUser] = useState(null);
  const id = AUTH.getPayload().sub;

  const handleChange = (e) => setQuery(e.target.value);
  const handleSearch = (e) => setIsUpdated(true);

  useEffect(() => {
    if (query) {
      setSearchedData(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleUser(id))
      .then(({ data }) => {
        setCurrentUser(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const logout = () => {
    AUTH.logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <Box>
      <AppBar>
        <Toolbar
          className='navbar'
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              paddingTop: '5px',
              paddingBottom: '5px'
            }}
            className='site-options'
          >
            <p onClick={navigateToHome} className='navbar-item home-icon'>
              Poet's Corner
            </p>
            <Box className='search-bar'>
              <TextField
                sx={{ width: 200, paddingRight: '10px', paddingLeft: '10px' }}
                value={query}
                onChange={handleChange}
                label='Search'
              />
              <Box
                name='search-browse-buttons'
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <Link to='/search' className='navbar-item'>
                  <CommonButton
                    className='navbar-item'
                    onClick={handleSearch}
                    sx={{ color: 'black', marginBottom: '0px' }}
                  >
                    Search
                  </CommonButton>
                </Link>
                <Link to='/browse' className='navbar-item'>
                  <CommonButton
                    className='navbar-item'
                    onClick={handleSearch}
                    sx={{
                      color: 'black',
                      marginBottom: '0px',
                      paddingLeft: '10px'
                    }}
                  >
                    Browse
                  </CommonButton>
                </Link>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              paddingTop: '5px',
              paddingBottom: '5px'
            }}
            className='user-options'
          >
            {isLoggedIn ? (
              <>
                <CommonTypography
                  sx={{ alignSelf: 'center', paddingTop: 0.5 }}
                  className='navbar-item'
                  onClick={logout}
                >
                  Logout
                </CommonTypography>
                <p className='navbar-item' onClick={navigateToProfile}>
                  {currentUser?.username}
                </p>
                <Box className='navbar-profile-pic'>
                  <ProfilePicture
                    cloudinaryImageId={currentUser?.profile_image}
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{ alignItems: 'center', justifyContent: 'center' }}
                className='user-options'
              >
                <CommonButton
                  sx={{ paddingRight: '20px' }}
                  onClick={navigateToRegister}
                >
                  Register
                </CommonButton>
                <CommonButton onClick={navigateToLogin}>Login</CommonButton>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
