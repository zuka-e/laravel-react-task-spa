import { Theme, withStyles } from '@material-ui/core/styles';
import { LinearProgress, LinearProgressProps } from '@material-ui/core';

const Progressbar = withStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}))((props: LinearProgressProps) => (
  <LinearProgress variant='query' color='secondary' {...props} />
));

export default Progressbar;
