import { withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Typography, TypographyProps } from '@material-ui/core';

const root: CSSProperties = {
  display: '-webkit-box',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': 3,
  overflow: 'hidden',
};

const TypographyWithLimitedRows = withStyles({ root })(
  (props: TypographyProps) => <Typography {...props} />
);

export default TypographyWithLimitedRows;
