import React from 'react';

import { Header, Footer, Progressbar } from 'layouts';

const StandbyScreen: React.FC = () => {
  return (
    <React.Fragment>
      <Header />
      <Progressbar />
      <Footer />
    </React.Fragment>
  );
};

export default StandbyScreen;
