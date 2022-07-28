import React, { useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Card, Divider, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { fetchTaskBoards, FetchTaskBoardsRequest } from 'store/thunks/boards';
import {
  useAppDispatch,
  useAppSelector,
  useDeepEqualSelector,
  useQuery,
} from 'utils/hooks';
import { BaseLayout, StandbyScreen } from 'layouts';
import { LinkWrapper, ScrolledDiv } from 'templates';
import { ButtonToAddTask } from 'components/boards';
import { BoardCardHeader } from 'components/boards/TaskBoard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    content: {
      height: '150px',
      padding: theme.spacing(2),
      marginTop: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
    pagination: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    paginationUl: {
      justifyContent: 'center',
    },
  })
);

const TaskBoardIndex: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const query = { page: useQuery().get('page') || '' };
  const params = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const boards = useDeepEqualSelector((state) => state.boards.data);
  const count = useAppSelector((state) => state.boards.meta.last_page);
  const currentPage = useAppSelector((state) => state.boards.meta.current_page);

  useEffect(() => {
    const request: FetchTaskBoardsRequest = {
      userId: params.userId,
      page: query.page,
    };
    dispatch(fetchTaskBoards(request));
  }, [dispatch, params.userId, query.page]);

  const handleChange = (_e: React.ChangeEvent<unknown>, page: number) =>
    history.push(`?page=${String(page)}`);

  if (!boards || userId !== params.userId) return <StandbyScreen />;

  return (
    <BaseLayout subtitle="Boards">
      <Container component="main" className={classes.main}>
        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid item lg={3} md={4} xs={6} key={board.id}>
              <Card elevation={7}>
                <LinkWrapper to={`/users/${params.userId}/boards/${board.id}`}>
                  <ScrolledDiv className={classes.content}>
                    <Typography>{board.description}</Typography>
                  </ScrolledDiv>
                </LinkWrapper>
                <Divider />
                <BoardCardHeader board={board} />
              </Card>
            </Grid>
          ))}
          <Grid item lg={3} sm={4} xs={6}>
            <ButtonToAddTask method="POST" model="board" />
          </Grid>
        </Grid>
      </Container>

      {boards.length > 0 && count && currentPage && (
        <Pagination
          count={count}
          page={currentPage}
          siblingCount={2}
          color="primary"
          size="large"
          onChange={handleChange}
          classes={{ root: classes.pagination, ul: classes.paginationUl }}
        />
      )}
    </BaseLayout>
  );
};

export default TaskBoardIndex;
