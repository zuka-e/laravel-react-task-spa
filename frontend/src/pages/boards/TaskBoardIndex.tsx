import React, { useEffect } from 'react';

import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  LinearProgress,
  Container,
  Grid,
  Card,
  CardHeader,
  Typography,
  Box,
  IconButton,
  List,
} from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';

import { APP_NAME } from 'config/app';
import { fetchTaskBoards, FetchTaskBoardsRequest } from 'store/thunks/boards';
import { useAppDispatch, useAppSelector, useQuery } from 'utils/hooks';
import { Header, Footer } from 'layouts';
import {
  LightTooltip,
  LinkWrapper,
  ScrolledBox,
  ScrolledTypography,
  PopoverControl,
} from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    containerf: {
      color: 'red',
    },
    cardHeader: {
      paddingTop: theme.spacing(1),
      justifyContent: 'space-between',
    },
    cardHeaderAction: {
      alignSelf: 'flex-end',
    },
    cardHeaderContent: {
      maxWidth: '93%',
    },
  })
);

const TaskBoardIndex: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const query = { page: useQuery().get('page') || '' };
  const params = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.boards);
  const loading = state.loading;
  const boards = state.data;
  const count = state.meta.last_page;
  const currentPage = state.meta.current_page;

  useEffect(() => {
    window.scrollTo(0, 0);
    const request: FetchTaskBoardsRequest = {
      userId: params.userId,
      page: query.page,
    };
    dispatch(fetchTaskBoards(request));
  }, [dispatch, params.userId, query.page]);

  const handleChange = (_e: React.ChangeEvent<unknown>, page: number) =>
    history.push(`?page=${String(page)}`);

  if (loading && !boards)
    return (
      <React.Fragment>
        <Header />
        <Footer />
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <Helmet>
        <title>Boards | {APP_NAME}</title>
      </Helmet>
      <Header />
      {loading && (
        <Box mt={2}>
          <LinearProgress variant='query' />
        </Box>
      )}
      <Container component='main' className={classes.container}>
        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid item lg={3} md={4} xs={6} key={board.id}>
              <Card elevation={7}>
                <LinkWrapper to={`/users/${params.userId}/boards/${board.id}`}>
                  <ScrolledBox height='150px' p={2} mt={0.5} mr={0.5}>
                    <Typography>{board.description}</Typography>
                  </ScrolledBox>
                </LinkWrapper>
                <CardHeader
                  classes={{
                    root: classes.cardHeader,
                    action: classes.cardHeaderAction,
                    content: classes.cardHeaderContent,
                  }}
                  disableTypography
                  title={
                    <LightTooltip title={board.title} enterDelay={100}>
                      <ScrolledTypography>{board.title}</ScrolledTypography>
                    </LightTooltip>
                  }
                  subheader={
                    <Typography color='textSecondary' variant='body2'>
                      {moment(board.updatedAt).calendar()}
                    </Typography>
                  }
                  action={
                    <PopoverControl
                      trigger={
                        <IconButton aria-label='board-settings' size='small'>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                      <BoardMenuList />
                    </PopoverControl>
                  }
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {count && currentPage && (
        <Box display='flex' justifyContent='center' my={4}>
          <Pagination
            count={count}
            page={currentPage}
            siblingCount={2}
            color='primary'
            size='large'
            onChange={handleChange}
          />
        </Box>
      )}
      <Footer />
    </React.Fragment>
  );
};

export default TaskBoardIndex;

const BoardMenuList = () => (
  <List component='nav' aria-label='board-menu'></List>
);
