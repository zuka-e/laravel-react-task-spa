import React, { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Divider } from '@material-ui/core';

import { useAppDispatch, useDeepEqualSelector, useQuery } from 'utils/hooks';
import { fetchTaskBoard, FetchTaskBoardRequest } from 'store/thunks/boards';
import { BaseLayout, StandbyScreen } from 'layouts';
import {
  PopoverControl,
  ScrolledGridContainer,
  ScrolledTypography,
} from 'templates';
import { ButtonToAddTask } from 'components/boards';
import { MenuButton, TaskList, InfoBox } from 'components/boards/TaskBoard';

const boxWidth = '370px';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      paddingTop: theme.spacing(2),
      paddingRight: 0,
    },
    title: { fontSize: '2rem' },
    divider: { marginTop: theme.spacing(1) },
    listItems: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(4),
      '& > .listItem': {
        minWidth: boxWidth,
        padding: theme.spacing(1),
      },
    },
  })
);

const TaskBoard: React.FC = () => {
  const classes = useStyles();
  const query = { page: useQuery().get('page') || '' };
  const params = useParams<{ userId: string; boardId: string }>();
  const dispatch = useAppDispatch();
  const board = useDeepEqualSelector(
    (state) => state.boards.docs[params.boardId]
  );

  useEffect(() => {
    const request: FetchTaskBoardRequest = {
      userId: params.userId,
      boardId: params.boardId,
      page: query.page,
    };
    dispatch(fetchTaskBoard(request));
  }, [dispatch, params.userId, params.boardId, query.page]);

  if (!board) return <StandbyScreen />;

  return (
    <BaseLayout subtitle={board.title}>
      <Container component='main' maxWidth={false} className={classes.main}>
        <ScrolledGridContainer justify='space-between' alignItems='center'>
          <ScrolledTypography
            title={board.title}
            variant='h1'
            className={classes.title}
          >
            {board.title}
          </ScrolledTypography>
          <Grid item>
            <PopoverControl trigger={<MenuButton />}>
              {/* <BoardMenu boardId={boardId} /> */}
            </PopoverControl>
          </Grid>
        </ScrolledGridContainer>
        <Divider classes={{ root: classes.divider }} />
        <Grid container justify='space-between' wrap='nowrap'>
          <ScrolledGridContainer className={classes.listItems}>
            {board.lists?.map((list, i) => (
              <Grid item key={list.id} id={list.id} className='listItem'>
                <TaskList list={list} listIndex={i} />
              </Grid>
            ))}
            <Grid item className='listItem'>
              <ButtonToAddTask method='POST' type='list' parent={board} />
            </Grid>
          </ScrolledGridContainer>
          <InfoBox />
        </Grid>
      </Container>
    </BaseLayout>
  );
};

export default TaskBoard;
