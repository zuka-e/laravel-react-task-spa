import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Typography, Box } from '@material-ui/core';

import hero from 'images/hero.svg';
import HeroAction from './HeroAction';

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
  })
);

const Hero: React.FC = () => {
  const classes = useStyles();

  return (
    <Box component='main' className={classes.root}>
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
            <HeroAction />
          </Grid>
          <Grid item md={5} sm={10} xs={10}>
            <img src={hero} alt='hero' width='100%' height='100%' />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
