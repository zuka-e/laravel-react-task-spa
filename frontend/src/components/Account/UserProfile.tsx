import { Grid, TextField } from '@material-ui/core';
import { User } from '../../models/User';

const UserProfile: React.FC<{ user: User }> = (props) => {
  const { user } = props;

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <TextField
          disabled
          variant='outlined'
          margin='normal'
          fullWidth
          id='username'
          label='Username'
          autoComplete='username'
          defaultValue={user.name}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          disabled
          variant='outlined'
          margin='normal'
          fullWidth
          id='email'
          label='Email Address'
          autoComplete='email'
          defaultValue={user.email}
        />
      </Grid>
    </Grid>
  );
};

export default UserProfile;
