import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Card, Avatar, Typography, Box } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { APP_NAME } from '../../config/app';

const Copyright = () => {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      © {APP_NAME} {new Date().getFullYear()}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
  },
}));

type FormLayoutProps = {
  title: string;
};

const FormLayout: React.FC<FormLayoutProps> = (props) => {
  const { children, title } = props;
  const classes = useStyles();

  return (
    <Container component='main' maxWidth='xs'>
      <Card className={classes.paper} elevation={2}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          {title}
        </Typography>
        {children}
      </Card>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default FormLayout;
