import { Button, Grid } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { User } from '../../models/User';
import { useAppDispatch } from '../../store/hooks';
import { sendEmailVerificationLink } from '../../store/slices/authSlice';

const UserStatus: React.FC<{ user: User }> = (props) => {
  const { user } = props;
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(sendEmailVerificationLink());
  };

  const showEmailVerificationState = () => {
    return !!user.emailVerifiedAt ? (
      <Alert severity='success'>
        <AlertTitle>Success</AlertTitle>
        認証済みです
      </Alert>
    ) : (
      <Alert
        severity='warning'
        action={
          <Button variant='contained' color='secondary' onClick={handleClick}>
            メールを再送信する
          </Button>
        }
      >
        <AlertTitle>Warning</AlertTitle>
        メール認証が完了しておりません
      </Alert>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        {showEmailVerificationState()}
      </Grid>
    </Grid>
  );
};

export default UserStatus;
