import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Typography, Button, Box } from '@material-ui/core';
import filingSystem from '../../images/filing_system.svg';
import drag from '../../images/drag.svg';
import search from '../../images/search.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background:
        'repeating-linear-gradient(240deg, #e0fffa87, transparent 250px)',
    },
    container: {
      marginTop: theme.spacing(12),
      marginBottom: theme.spacing(12),
      [theme.breakpoints.up('sm')]: {
        minHeight: '90vh',
      },
    },
    features: {
      marginBottom: theme.spacing(4),
    },
    feature: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      padding: theme.spacing(4, 5),
    },
    title: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
    buttonLink: {
      minWidth: '300px',
      '&:hover': {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
      },
    },
  })
);

const Features: React.FC = () => {
  const classes = useStyles();

  const FeaturesLayout: React.FC<{
    children: React.ReactNode;
    image: string;
    title: string;
  }> = ({ children, image, title }) => (
    <Grid item md={4} sm={9} xs={11}>
      <Box className={classes.feature}>
        <img src={image} alt={image} width='100%' height='100%' />
        <Typography variant='h3' component='h2' className={classes.title}>
          {title}
        </Typography>
        <Typography variant='h5' component='p'>
          {children}
        </Typography>
      </Box>
    </Grid>
  );

  return (
    <Box component='section' className={classes.root}>
      <Container className={classes.container}>
        <Grid container justify='space-around' className={classes.features}>
          <FeaturesLayout image={filingSystem} title='サブタスク管理'>
            つれづれなるまゝに、日暮らし、硯にむかひて、心にうつりゆくよしなし事を、そこはかとなく書きつくれば、あやしうこそものぐるほしけれ。
          </FeaturesLayout>
          <FeaturesLayout image={drag} title='ドラッグ&amp;ドロップ'>
            つれづれなるまゝに、日暮らし、硯にむかひて、心にうつりゆくよしなし事を、そこはかとなく書きつくれば、あやしうこそものぐるほしけれ。
          </FeaturesLayout>
          <FeaturesLayout image={search} title='タスク検索'>
            つれづれなるまゝに、日暮らし、硯にむかひて、心にうつりゆくよしなし事を、そこはかとなく書きつくれば、あやしうこそものぐるほしけれ。
          </FeaturesLayout>
        </Grid>
        <Box textAlign='center' mt={12} mb={8}>
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
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
