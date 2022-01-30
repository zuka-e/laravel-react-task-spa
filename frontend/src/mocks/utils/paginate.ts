import { RestRequest } from 'msw';

import { DocumentBase } from 'mocks/models';
import { PaginationResponse } from 'utils/api';

type PaginateProps<T> = {
  req: RestRequest;
  allData: T[];
  perPage?: number;
};

export const paginate = <T extends DocumentBase>(props: PaginateProps<T>) => {
  const { req, allData } = props;

  /** APIエンドポイントの内クエリパラメータ (`?page=`) を除外した部分 */
  const path = req.url.origin + req.url.pathname;
  /** @prop page - パラメータ未指定 or `NaN` の場合 `1` () */
  const query = {
    page: parseInt(String(req.url.searchParams.get('page')), 10) || 1,
  };
  /** 一度に返却するデータ数 (任意の値) */
  const perPage = props.perPage || 20;
  /** `perPage`に収まらない分だけページ数を増加 (データが存在しない場合 `1`) */
  const lastPage = allData.length > 0 ? Math.ceil(allData.length / perPage) : 1;
  /** `lastPage` を超過するページ番号 or `0`以下が指定された場合 `1` */
  const currentPage = query.page > lastPage || query.page <= 0 ? 1 : query.page;
  /** `currentPage`で表示するデータの先頭インデックス (始点: `1`) */
  const from = perPage * (currentPage - 1) + 1;
  /** `currentPage`で表示するデータの後尾インデックス */
  const to =
    perPage * currentPage > allData.length
      ? allData.length
      : perPage * currentPage;

  const response: PaginationResponse<T> = {
    data: allData.slice(from - 1, to),
    links: {
      first: path + '?page=' + 1,
      last: path + '?page=' + lastPage,
      next:
        currentPage === lastPage ? 'null' : path + '?page=' + (currentPage + 1),
      prev: currentPage === 1 ? 'null' : path + '?page=' + (currentPage - 1),
    },
    meta: {
      current_page: currentPage,
      last_page: lastPage,
      from: from,
      to: to,
      total: allData.length,
      per_page: perPage,
      path: path,
      links: [],
    },
  };

  addMetaLinks(response);

  return response;
};

/**
 * `PaginationResponse`の`meta`に`links`を設定する
 * */
const addMetaLinks = (props: PaginationResponse<any>) => {
  const count = props.meta.last_page + 2; // page総数 + 2 (prev, next);
  Array(count)
    .fill('_')
    .forEach((_, i) => {
      if (i === 0) {
        props.meta.links.push({
          url: props.links.prev,
          label: '&laquo; Prev',
          active: false,
        });
      } else if (i === count - 1) {
        props.meta.links.push({
          url: props.links.next,
          label: 'Next &raquo;',
          active: false,
        });
      } else {
        props.meta.links.push({
          url: props.meta.path + '?page=' + i,
          label: String(i),
          active: i === props.meta.current_page,
        });
      }
    });
};
