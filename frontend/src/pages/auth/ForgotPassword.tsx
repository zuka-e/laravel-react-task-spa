import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button, Divider, Grid, Box } from '@material-ui/core';

import { ForgotPasswordRequest, forgotPassword } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { BaseLayout, FormLayout } from 'layouts';
import { SubmitButton } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    link: {
      color: theme.palette.info.dark,
    },
  })
);

type FormData = ForgotPasswordRequest;

const formdata: Record<keyof FormData, { id: string; label: string }> = {
  email: {
    id: 'email',
    label: 'Email Address',
  },
};

const schema = yup.object().shape({
  email: yup.string().label(formdata.email.label).email().required(),
});

const ForgotPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(forgotPassword(data));
    if (forgotPassword.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    }
  };

  return (
    <BaseLayout subtitle='Forgot Password' withoutHeaders>
      <FormLayout title={'Forgot Password?'} message={message}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id={formdata.email.id}
            label={formdata.email.label}
            autoComplete={formdata.email.id}
            {...register('email')}
            helperText={errors?.email?.message}
            error={!!errors?.email}
          />
          <Box mt={4} mb={3}>
            <SubmitButton fullWidth>Send password reset email</SubmitButton>
          </Box>
          <Box mt={1} mb={2}>
            <Divider />
          </Box>
          <Grid container justify='flex-end'>
            <Grid item>
              Back to
              <Button size='small' onClick={() => history.push('/login')}>
                <span className={classes.link}>Sign in</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </BaseLayout>
  );
};

export default ForgotPassword;
