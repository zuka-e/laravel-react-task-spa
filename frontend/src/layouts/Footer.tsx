import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Link, Box, Typography } from '@material-ui/core';

import { APP_NAME } from 'config/app';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      marginTop: 'auto',
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(1),
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  })
);

const Copyright = () => (
  <Typography variant="body2" color="inherit">
    © {APP_NAME} {new Date().getFullYear()}
  </Typography>
);

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <Container component="footer" className={classes.footer} maxWidth={false}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Link component={RouterLink} to="/terms" color="inherit">
            Terms
          </Link>
          <Box display="inline" borderLeft="1px solid" ml={1} pl={1} />
          <Link component={RouterLink} to="/privacy" color="inherit">
            Privacy
          </Link>
        </Grid>
        <Grid item>
          <Copyright />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
