import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';

/**
 * Route values that Next `router` object doesn't have directly.
 *
 * @see https://nextjs.org/docs/api-reference/next/router#router-object
 */
export type AppRoute = {
  /**
   * Pathname without query string. - *e.g.*`'/users/1'`
   */
  pathname: string;
  /**
   * Query string followed by `?` - *e.g.*`'page=1&key=value'`
   */
  queryString?: string;
  /**
   * Path parameters as key-value object - *e.g.*`{ userId: 1 }`
   * The key name is determined by the filename.
   */
  pathParams: NextRouter['query'];
  /**
   * Query parameters as key-value object - *e.g.*`{ page: 1 }`
   */
  queryParams: NextRouter['query'];
};

/**
 * Return the route object including values
 * that Next `router` object doesn't have directly.
 */
const useRoute = (): AppRoute => {
  const router = useRouter();

  /**
   * Note:
   * In terms of [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes),
   * on the server side or until the router is ready (router.isReady === true),
   * `asPath` value is the same as `pathname`.
   * For example, it's like `/users/[userId]`, not `/users/1`.
   * In that time, `query` value is empty `{}`, not like `{ userId: '1' }`.
   * After the router is ready on the client side, the values are updated.
   */
  const pathAndQuery = router.asPath.split('?');
  const pathname = pathAndQuery[0];
  const queryString = pathAndQuery[1] as AppRoute['queryString'];

  const pathParams = (getPathParamNames(router) ?? []).reduce(
    (obj: NextRouter['query'], pathParamName: string) => {
      // Create an object including only path parameters.
      obj[pathParamName] = router.query[pathParamName];
      return obj;
    },
    {}
  );

  const queryParams =
    queryString
      ?.split('&')
      .reduce((obj: NextRouter['query'], eachQueryString) => {
        const queryNameAndValue = eachQueryString.split('=');
        const queryName = queryNameAndValue[0];
        const queryValue = queryNameAndValue[1] ?? '';

        obj[queryName] = queryValue;
        return obj;
      }, {}) ?? {};

  return {
    pathname,
    queryString,
    pathParams,
    queryParams,
  };
};

/**
 * Get the path parameter keys from NextRouter.
 *
 * @example
 * router.pathname ==='/users/[userId]' => ['userId']
 */
const getPathParamNames = (router: NextRouter): string[] | null =>
  router.pathname.match(/(?<=\[)[^\]]+(?=\])/g);

export default useRoute;
