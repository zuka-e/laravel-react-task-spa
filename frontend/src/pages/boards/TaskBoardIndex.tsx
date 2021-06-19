import React, { useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Card, Typography, Box } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { fetchTaskBoards, FetchTaskBoardsRequest } from 'store/thunks/boards';
import { useAppDispatch, useAppSelector, useQuery } from 'utils/hooks';
import { BaseLayout, StandbyScreen } from 'layouts';
import { LinkWrapper, ScrolledBox } from 'templates';
import { BoardCardHeader } from 'components/boards/TaskBoardIndex';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
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
  const boards = state.data;
  const count = state.meta.last_page;
  const currentPage = state.meta.current_page;

  useEffect(() => {
    const request: FetchTaskBoardsRequest = {
      userId: params.userId,
      page: query.page,
    };
    dispatch(fetchTaskBoards(request));
  }, [dispatch, params.userId, query.page]);

  const handleChange = (_e: React.ChangeEvent<unknown>, page: number) =>
    history.push(`?page=${String(page)}`);

  if (!boards) return <StandbyScreen />;

  return (
    <BaseLayout subtitle='Boards'>
      <Container component='main' className={classes.main}>
        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid item lg={3} md={4} xs={6} key={board.id}>
              <Card elevation={7}>
                <LinkWrapper to={`/users/${params.userId}/boards/${board.id}`}>
                  <ScrolledBox height='150px' p={2} mt={0.5} mr={0.5}>
                    <Typography>{board.description}</Typography>
                  </ScrolledBox>
                </LinkWrapper>
                <BoardCardHeader board={board} />
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
    </BaseLayout>
  );
};

export default TaskBoardIndex;
