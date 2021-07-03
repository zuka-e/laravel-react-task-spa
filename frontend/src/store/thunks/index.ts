// `createAsyncThunk` returns a standard Redux thunk action creator.

export type RejectWithValueType = {
  error: {
    message?: string;
    data: any;
  };
};

/**
 * Laravelからデータの配列と共にページネーションに関する情報及びリンクをリクエストする際のレスポンスタイプ
 *
 * @param data 受け取るデータ本体の配列
 * @param links 隣り合うページ及び端のページのリンク
 * @param meta 現在のページやデータ総数などの情報
 * @link https://laravel.com/docs/8.x/eloquent-resources#pagination
 */
export type DataWithPagination<T extends object> = {
  data: T[];
  links: {
    first: string;
    last: string;
    next: string;
    prev: string;
  };
  meta: {
    current_page: number;
    last_page: number;
    from: number; // 表示中`data`の最初のインデックス
    to: number; // 表示中`data`の最後のインデックス
    total: number; // `data`総数
    per_page: number; // 一度に表示するデータ数
    path: string; // クエリ`?page=`を除いたURL
    links: {
      url: string; // 各ページへのURL ([0]は前ページ, [-1]は次ページ)
      label: string; // ページ表示用に利用できる文字 (例: "Next &raquo;")
      active: boolean; // 現在のページのみ`true`
    }[];
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
export * from './signOutFromAPI';
export * from './deleteAccount';
