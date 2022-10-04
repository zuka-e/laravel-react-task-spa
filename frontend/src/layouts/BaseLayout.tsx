import { Header, Footer } from 'layouts';

type BaseLayoutProps = { withoutHeaders?: boolean };

const BaseLayout: React.FC<BaseLayoutProps> = (props) => (
  <>
    {!props.withoutHeaders && <Header />}
    {props.children}
    {!props.withoutHeaders && <Footer />}
  </>
);

export default BaseLayout;
