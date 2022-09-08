import { useRouter } from 'next/router';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Typography, List, ListItem } from '@material-ui/core';
import {
  PersonAdd as PersonAddIcon,
  LockOpen as LockOpenIcon,
  Menu as MenuIcon,
} from '@material-ui/icons';

import { GUEST_EMAIL, GUEST_NAME, GUEST_PASSWORD } from 'config/app';
import { createUser, signInWithEmail } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { makeEmail } from 'utils/generator';
import { AlertButton, LinkButton, PopoverControl } from 'templates';
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
    catchphrase: { marginBottom: theme.spacing(6) },
  })
);

const Hero = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleGuestSignUp = async () => {
    const user = {
      name: GUEST_NAME,
      email: makeEmail(),
      password: GUEST_PASSWORD,
      password_confirmation: GUEST_PASSWORD,
    };
    await router.push('/register'); // `EmailVerification`を表示するため
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
              <Typography variant="h1" className={classes.catchphrase}>
                タスク管理で課題を明確化
              </Typography>
              <Typography variant="h4" component="p" color="textSecondary">
                複雑なタスクを視覚的に確認し、現在の状況を把握した上で意思決定に役立てることができます。
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item>
                <LinkButton startIcon={<PersonAddIcon />} to="/register">
                  登録する
                </LinkButton>
              </Grid>
              <Grid item>
                <LinkButton
                  startIcon={<LockOpenIcon />}
                  color="secondary"
                  to="/login"
                >
                  ログイン
                </LinkButton>
              </Grid>
              <Grid item>
                <PopoverControl
                  trigger={
                    <AlertButton startIcon={<MenuIcon />} color="info">
                      又はゲストユーザーで試す
                    </AlertButton>
                  }
                >
                  <List component="nav">
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
            <img src={hero.src} alt="hero" width="100%" height="100%" />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default Hero;
