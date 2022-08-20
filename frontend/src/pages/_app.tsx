// https://nextjs.org/docs/advanced-features/custom-app
// https://nextjs.org/docs/basic-features/typescript#custom-app
// https://nextjs.org/docs/messages/no-document-viewport-meta
// e.g. https://github.com/vercel/next.js/blob/canary/examples/with-redux/src/pages/_app.tsx

import { AppProps } from 'next/app';
import Head from 'next/head';

import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';

import { APP_NAME } from 'config/app';
import store from 'store';
import theme from 'theme';
import { FlashNotification, Loading } from 'layouts';

import 'styles/globals.css';
import 'config/moment';

(async () => {
  if (process.env.NODE_ENV === 'development') {
    import('mocks/data');

    const { worker } = await import('mocks/browser');

    worker.start({ onUnhandledRequest: 'warn' });
  }
})();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        {/* https://nextjs.org/docs/messages/no-document-viewport-meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* https://nextjs.org/docs/messages/no-document-title */}
        <title>{APP_NAME}</title>
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DndProvider backend={HTML5Backend}>
              <CssBaseline />
              <Loading />
              <FlashNotification />
              <Component {...pageProps} />
            </DndProvider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
};

export default App;