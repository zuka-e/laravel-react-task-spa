import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Divider, Grid, Box } from '@material-ui/core';

import { ForgotPasswordRequest, forgotPassword } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { FormLayout } from 'layouts';
import { AlertButton, SubmitButton } from 'templates';
import type { GuestPage } from 'routes';

type FormData = ForgotPasswordRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  email: {
    id: 'email',
    label: 'Email Address',
  },
};

const schema = yup.object().shape({
  email: yup.string().label(formData.email.label).email().required(),
});

type ForgotPasswordProps = GuestPage;

export const getStaticProps: GetStaticProps<ForgotPasswordProps> = async () => {
  return {
    props: {
      guest: true,
    },
    revalidate: 10,
  };
};

const ForgotPassword = () => {
  const router = useRouter();
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
    if (forgotPassword.rejected.match(response))
      setMessage(response.payload?.error?.message);
    else setMessage('');
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <FormLayout title={'Forgot Password?'} message={message}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id={formData.email.id}
            label={formData.email.label}
            autoComplete={formData.email.id}
            {...register('email')}
            helperText={errors?.email?.message}
            error={!!errors?.email}
          />
          <Box my={4}>
            <SubmitButton fullWidth>{'Send password reset email'}</SubmitButton>
          </Box>
          <Box mb={2}>
            <Divider />
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              {'Back to'}
              <AlertButton
                color="info"
                variant="text"
                size="small"
                onClick={() => router.push('/login')}
              >
                {'Sign in'}
              </AlertButton>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </>
  );
};

export default ForgotPassword;
