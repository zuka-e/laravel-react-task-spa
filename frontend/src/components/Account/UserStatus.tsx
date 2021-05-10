import { Button, Grid } from '@material-ui/core';
import { useAppDispatch } from '../../store/hooks';
import { sendEmailVerificationLink } from '../../store/slices/authSlice';
import AlertMessage from '../../templates/AlertMessge';
import { isVerified } from '../../utils/auth';

const UserStatus: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(sendEmailVerificationLink());
  };

  const AlertAction = () => (
    <Button variant='contained' color='secondary' onClick={handleClick}>
      メールを再送信する
    </Button>
  );

  const showEmailVerificationState = () => {
    return isVerified() ? (
      <AlertMessage severity='success' body='認証済みです' />
    ) : (
      <AlertMessage
        severity='warning'
        action={<AlertAction />}
        body='メール認証が完了しておりません'
      ></AlertMessage>
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
