import React from 'react';

import { isLoading } from 'utils/api';
import { Header, Footer, Progressbar } from 'layouts';

const StandbyScreen: React.FC = () => {
  return (
    <React.Fragment>
      <Header />
      {isLoading() && <Progressbar />}
      <Footer />
    </React.Fragment>
  );
};

export default StandbyScreen;
