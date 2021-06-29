import React, { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Divider } from '@material-ui/core';

import { useAppDispatch, useAppSelector, useQuery } from 'utils/hooks';
import { fetchTaskBoard, FetchTaskBoardRequest } from 'store/thunks/boards';
import { BaseLayout, StandbyScreen } from 'layouts';
import {
  PopoverControl,
  ScrolledGridContainer,
  ScrolledTypography,
} from 'templates';
import { MenuButton, TaskList, InfoBox } from 'components/boards/TaskBoard';

const boxWidth = '370px';
const styles = {
  openInfoBox: { maxWidth: '100%', minWidth: boxWidth },
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      paddingTop: theme.spacing(2),
      paddingRight: 0,
    },
    listItems: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(4),
    },
    listItem: {
      minWidth: boxWidth,
      padding: theme.spacing(1),
    },
    sideBox: {
      transition: theme.transitions.create('all'),
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      maxWidth: 0,
      minWidth: 0,
      '& > div': {
        position: 'absolute',
        height: '100%',
        maxWidth: '100%',
        minWidth: boxWidth,
        borderLeft: '1px solid ' + theme.palette.divider,
      },
    },
  })
);

const TaskBoard: React.FC = () => {
  const classes = useStyles();
  const query = { page: useQuery().get('page') || '' };
  const params = useParams<{ userId: string; boardId: string }>();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.boards);
  const board = state.docs[params.boardId];

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
          <ScrolledTypography variant='h1' color='textSecondary'>
            {board.title}
          </ScrolledTypography>
          <Grid item>
            <PopoverControl trigger={<MenuButton />}>
              {/* <BoardMenu boardId={boardId} /> */}
            </PopoverControl>
          </Grid>
        </ScrolledGridContainer>
        <Divider />
        <Grid container justify='space-between' wrap='nowrap'>
          <ScrolledGridContainer className={classes.listItems}>
            {board.lists?.map((list, i) => (
              <Grid item key={list.id} className={classes.listItem}>
                <TaskList list={list} listIndex={i} />
              </Grid>
            ))}
            <Grid item className={classes.listItem}>
              {/* <AddTaskButton list id={boardId} /> */}
            </Grid>
          </ScrolledGridContainer>
          <Grid
            item
            className={classes.sideBox}
            style={state.infoBox.open ? styles.openInfoBox : undefined}
          >
            <InfoBox type={state.infoBox.type} data={state.infoBox.data} />
          </Grid>
        </Grid>
      </Container>
    </BaseLayout>
  );
};

export default TaskBoard;
