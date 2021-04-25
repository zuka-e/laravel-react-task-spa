import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Button, TextField } from '@material-ui/core';
import FormLayout from './FormLayout';
import { APP_NAME } from '../../config/app';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    link: {
      color: theme.palette.info.dark,
    },
  })
);

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <React.Fragment>
      <Helmet>
        <title>Registration | {APP_NAME}</title>
      </Helmet>
      <FormLayout title={'Create an account'}>
        <form className={classes.form} noValidate>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoComplete='username'
            autoFocus
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password-confirmation'
            label='Password Confirmation'
            type='password'
            id='password-confirmation'
            autoComplete='password-confirmation'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Create an account
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              Already have an account?&nbsp;
              <Button size='small' onClick={() => history.push('/login')}>
                <span className={classes.link}>Sign in</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </React.Fragment>
  );
};

export default SignUp;
