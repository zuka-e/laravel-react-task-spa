import * as auth from './auth';
import * as boards from './boards';

// HTTPメソッドとリクエストパス(第一引数)を指定し、`Request handler`を生成
// リクエストに対応するレスポンスのモックを`Response resolver`により作成
export const handlers = [...auth.handlers, ...boards.handlers];
