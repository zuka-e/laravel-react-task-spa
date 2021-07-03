import { Theme, withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: theme.typography.pxToRem(15),
    maxWidth: 250,
    padding: '8px 16px',
    boxShadow: theme.shadows[10],
    borderRadius: '8px',
  },
}))(Tooltip);

export default LightTooltip;
