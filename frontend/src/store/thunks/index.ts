// `createAsyncThunk` returns a standard Redux thunk action creator.

export type RejectWithValueType = {
  error: {
    message?: string;
    data: any;
  };
};
