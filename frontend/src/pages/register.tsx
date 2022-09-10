import { useState } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Divider, Grid, Box } from '@material-ui/core';

import { SignUpRequest, createUser } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { BaseLayout, FormLayout } from 'layouts';
import { AlertButton, LabeledCheckbox, SubmitButton } from 'templates';
import type { GuestPage } from 'routes';

// Input items
type FormData = SignUpRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  email: {
    id: 'email',
    label: 'Email Address',
  },
  password: {
    id: 'password',
    label: 'Password',
  },
  password_confirmation: {
    id: 'password-confirmation',
    label: 'Password Confirmation',
  },
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  email: yup.string().label(formData.email.label).email().required(),
  password: yup
    .string()
    .label(formData.password.label)
    .required()
    .min(8)
    .max(20),
  password_confirmation: yup
    .string()
    .label(formData.password_confirmation.label)
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

type RegisterProps = GuestPage;

export const getStaticProps: GetStaticProps<RegisterProps> = async () => {
  return {
    props: {
      guest: true,
    },
    revalidate: 10,
  };
};

const SignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register, // 入力項目の登録
    handleSubmit, // 用意された`handleSubmit`
    formState: { errors }, // エラー情報 (メッセージなど)
  } = useForm<FormData>({
    mode: 'onBlur', // バリデーション判定タイミング
    resolver: yupResolver(schema),
  });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(createUser(data));
    if (createUser.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    }
  };

  return (
    <BaseLayout subtitle="Registration" withoutHeaders>
      <FormLayout title={'Create an account'} message={message}>
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id={formData.password.id}
            label={formData.password.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.password.id}
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
          <TextField
            variant="outlined"
            // margin='normal'
            required
            fullWidth
            id={formData.password_confirmation.id}
            label={formData.password_confirmation.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.password_confirmation.id}
            {...register('password_confirmation')}
            helperText={
              errors?.password_confirmation?.message || 'Retype password'
            }
            error={!!errors?.password_confirmation}
          />
          <Box ml={1} mb={2}>
            <LabeledCheckbox
              label="Show Password"
              checked={visiblePassword}
              setChecked={setVisiblePassword}
            />
          </Box>
          <Box my={4}>
            <SubmitButton fullWidth>{'Create an account'}</SubmitButton>
          </Box>
          <Box mb={2}>
            <Divider />
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              {'Already have an account? '}
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
    </BaseLayout>
  );
};

export default SignUp;
