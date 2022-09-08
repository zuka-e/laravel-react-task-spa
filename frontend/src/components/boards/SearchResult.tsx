import React, { useEffect, useMemo, useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  CardContent,
} from '@material-ui/core';

import { useAppDispatch, useDeepEqualSelector, useRoute } from 'utils/hooks';
import { openInfoBox } from 'store/slices';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textPrimary: { fontWeight: 'bold' },
    textSecondary: {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 5,
    },
    subheader: {
      borderBottom: '1px solid ' + theme.palette.primary.main,
      '& > li': {
        backgroundColor: theme.palette.background.paper,
        borderLeft: '3px solid ' + theme.palette.primary.main,
        borderBottom: '1px solid ' + theme.palette.primary.main,
        lineHeight: 1.2,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
    },
  })
);

type SearchResultProps = {
  input: string;
};

const SearchResult: React.FC<SearchResultProps> = (props) => {
  const { input } = props;
  const classes = useStyles();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const lists = useDeepEqualSelector(
    (state) => state.boards.docs[route.queryParams.boardId?.toString()].lists
  );
  // `useMemo`: `useEffect`依存配列による無限ループを防止
  const cards = useMemo(() => {
    return lists.reduce(
      (prev: typeof lists[0]['cards'], current) => [...prev, ...current.cards],
      []
    );
  }, [lists]);

  // 検索に合致したデータ
  const [results, setResults] = useState({
    lists: [] as typeof lists,
    cards: [] as typeof cards,
  });

  useEffect(() => {
    if (!input) {
      setResults({ lists: [], cards: [] });
      return;
    }

    const queryParam = input.toLowerCase();

    setResults({
      lists: lists.filter(
        (list) =>
          (list.title || '').toLowerCase().indexOf(queryParam) !== -1 ||
          (list.description || '').toLowerCase().indexOf(queryParam) !== -1
      ),
      cards: cards.filter(
        (card) =>
          (card.title || '').toLowerCase().indexOf(queryParam) !== -1 ||
          (card.content || '').toLowerCase().indexOf(queryParam) !== -1
      ),
    });
  }, [cards, lists, input]);

  const handleClick = (payload: Parameters<typeof openInfoBox>[0]) => () => {
    dispatch(openInfoBox(payload));
  };

  if (Object.values(results).every((result) => result.length === 0))
    return <CardContent>{'ここに検索結果が表示されます。'}</CardContent>;

  return (
    <React.Fragment>
      {results.lists.length > 0 && (
        <List
          dense
          subheader={<ListSubheader>{'リスト'}</ListSubheader>}
          classes={{ subheader: classes.subheader }}
        >
          {results.lists.map((list) => (
            <ListItem
              key={list.id}
              button
              onClick={handleClick({ model: 'list', data: list })}
            >
              <ListItemText
                primary={list.title}
                secondary={list.description}
                classes={{
                  primary: classes.textPrimary,
                  secondary: classes.textSecondary,
                }}
              />
            </ListItem>
          ))}
        </List>
      )}

      {results.cards.length > 0 && (
        <List
          dense
          subheader={<ListSubheader>{'カード'}</ListSubheader>}
          classes={{ subheader: classes.subheader }}
        >
          {results.cards.map((card) => (
            <ListItem
              key={card.id}
              button
              onClick={handleClick({ model: 'card', data: card })}
            >
              <ListItemText
                primary={card.title}
                secondary={card.content}
                classes={{
                  primary: classes.textPrimary,
                  secondary: classes.textSecondary,
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </React.Fragment>
  );
};

export default SearchResult;
