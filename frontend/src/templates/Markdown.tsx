import { ReactNode } from 'react';

import MarkdownToJsx, { MarkdownToJSX } from 'markdown-to-jsx';
import { Typography } from '@material-ui/core';

const options: MarkdownToJSX.Options = {
  slugify: (str) => str, // 自動生成されるid属性を日本語で利用
  overrides: {
    h1: {
      component: (props) => (
        <Typography gutterBottom component="h1" variant="h3" {...props} />
      ),
    },
    h2: {
      component: (props) => (
        <Typography gutterBottom component="h2" variant="h4" {...props} />
      ),
    },
    h3: {
      component: (props) => (
        <Typography gutterBottom component="h3" variant="h5" {...props} />
      ),
    },
    h4: {
      component: (props) => (
        <Typography gutterBottom component="h4" variant="h6" {...props} />
      ),
    },
    p: { component: (props) => <Typography paragraph {...props} /> },
    ol: { props: { style: { paddingInlineStart: '1.6rem' } } },
    li: {
      component: (props) => <Typography component="li" {...props} />,
    },
  },
};

const Markdown: React.FC = ({ children }) => {
  return (
    <MarkdownToJsx options={options}>
      {children as string & ReactNode}
    </MarkdownToJsx>
  );
};

export default Markdown;
