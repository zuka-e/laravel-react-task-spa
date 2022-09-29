import { HttpErrorLayout } from 'layouts';

const NotFound = () => {
  return (
    <HttpErrorLayout
      title="404 Not Found"
      description="ページが見つかりませんでした。"
      hint="お探しのページは移動または削除された可能性があります。"
    />
  );
};

export default NotFound;
