import { Link as RouterLink, useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
} from '@material-ui/core';
import {
  PersonAdd as PersonAddIcon,
  LockOpen as LockOpenIcon,
  Menu as MenuIcon,
} from '@material-ui/icons';

import { GUEST_EMAIL, GUEST_NAME, GUEST_PASSWORD } from 'config/app';
import { createUser, signInWithEmail } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { makeEmail } from 'utils/generator';
import { PopoverControl } from 'templates';
import hero from 'images/hero.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      background:
        'repeating-linear-gradient(330deg, #ffa0320d, transparent 175px)',
    },
    container: {
      position: 'relative',
      marginTop: theme.spacing(12),
      marginBottom: theme.spacing(12),
      [theme.breakpoints.up('sm')]: {
        minHeight: '75vh',
      },
    },
    hero: {
      justifyContent: 'space-around',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
      },
    },
    description: {
      marginBottom: theme.spacing(12),
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(6),
      },
    },
    catchphrase: {
      fontSize: '3.6rem',
      marginBottom: theme.spacing(5),
    },
    buttonLink: {
      minWidth: '120px',
      '&:hover': {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
      },
    },
    infoBtn: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.info.light,
      '&:hover': {
        backgroundColor: theme.palette.info.main,
      },
    },
  })
);

const Hero = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleGuestSignUp = () => {
    const user = {
      name: GUEST_NAME,
      email: makeEmail(),
      password: GUEST_PASSWORD,
      password_confirmation: GUEST_PASSWORD,
    };
    history.push('/register'); // `EmailVerification`を表示するため
    dispatch(createUser(user));
  };

  const handleGuestSignIn = () => {
    const email = GUEST_EMAIL;
    const password = GUEST_PASSWORD;
    dispatch(signInWithEmail({ email, password }));
  };

  return (
    <main className={classes.main}>
      <Container className={classes.container}>
        <Grid container className={classes.hero}>
          <Grid item md={6}>
            <div className={classes.description}>
              <Typography variant='h1' className={classes.catchphrase}>
                タスク管理を。
              </Typography>
              <Typography variant='h4' component='p' color='textSecondary'>
                つれづれなるまゝに、日暮らし、硯にむかひて、心にうつりゆくよしなし事を、そこはかとなく書きつくれば、あやしうこそものぐるほしけれ。
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  startIcon={<PersonAddIcon />}
                  variant='contained'
                  color='primary'
                  component={RouterLink}
                  to='/register'
                  className={classes.buttonLink}
                >
                  登録する
                </Button>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<LockOpenIcon />}
                  variant='contained'
                  color='secondary'
                  component={RouterLink}
                  to='/login'
                  className={classes.buttonLink}
                >
                  ログイン
                </Button>
              </Grid>
              <Grid item>
                <PopoverControl
                  trigger={
                    <Button
                      startIcon={<MenuIcon />}
                      variant='contained'
                      className={classes.infoBtn}
                    >
                      又はゲストユーザーで試す
                    </Button>
                  }
                >
                  <List component='nav'>
                    <ListItem button onClick={handleGuestSignUp}>
                      登録 (メール認証不可)
                    </ListItem>
                    <ListItem button onClick={handleGuestSignIn}>
                      ログイン (メール認証済み)
                    </ListItem>
                  </List>
                </PopoverControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={5} sm={10} xs={10}>
            <img src={hero} alt='hero' width='100%' height='100%' />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default Hero;
