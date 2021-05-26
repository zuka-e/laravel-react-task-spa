// `createAsyncThunk` returns a standard Redux thunk action creator.

export type RejectWithValueType = {
  error: {
    message?: string;
    data: any;
  };
};

// Enable imports from the higher level. Here is an example
// before: import { createUser } from 'store/thunks/createUser';
// after: import { createUser } from 'store/thunks';
export * from './createUser';
export * from './fetchAuthUser';
export * from './sendEmailVerificationLink';
export * from './signInWithEmail';
export * from './updateProfile';
export * from './updatePassword';
export * from './forgotPassoword';
export * from './resetPassword';
export * from './putSignOut';
export * from './deleteAccount';
