import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Typography, Button, Box } from '@material-ui/core';
import hero from '../../images/hero.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column-reverse',
      },
    },
    description: {
      marginBottom: theme.spacing(12),
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(6),
      },
    },
    catchphrase: {
      fontSize: '3.6rem',
      marginBottom: theme.spacing(5),
    },
    heroImage: {
      [theme.breakpoints.down('xs')]: {
        margin: 'auto',
      },
    },
    buttonLink: {
      minWidth: '120px',
      '&:hover': {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
      },
    },
  })
);

const Hero: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container component='main' className={classes.container}>
        <Grid container spacing={5} className={classes.hero}>
          <Grid item sm={7}>
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
                  variant='contained'
                  size='large'
                  color='primary'
                  component={RouterLink}
                  to='/register'
                  className={classes.buttonLink}
                >
                  始める
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='contained'
                  size='large'
                  color='secondary'
                  component={RouterLink}
                  to='/login'
                  className={classes.buttonLink}
                >
                  ログイン
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={5} xs={10} className={classes.heroImage}>
            <img src={hero} alt='hero' width='100%' height='100%' />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
