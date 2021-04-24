import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@material-ui/core';
import { APP_NAME } from '../config/app';
import { isSignedIn } from '../utils/auth';
import { useAppDispatch } from '../store/hooks';
import { putSignOut } from '../store/slices/authSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(putSignOut());
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      {isSignedIn() && <Button onClick={handleClick}>Logout</Button>}
    </React.Fragment>
  );
};

export default Home;
