import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

type LoadingProps = { open?: boolean };

const Loading = (props: LoadingProps) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={!!props.open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
