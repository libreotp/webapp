import React, { useState } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import CropFreeIcon from '@material-ui/icons/CropFree';
import { Link } from 'react-router-dom';
import { useLingui } from '@lingui/react';
import { t } from '@lingui/macro';

import AccountList from '../../components/AccountList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: '20px',
      marginBottom: '20px',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      width: '100%',
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

const Home: React.FC = () => {
  const classes = useStyles();

  const { i18n } = useLingui();

  const [filter, setFilter] = useState<string>('');

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder={`${i18n._(t`Search accounts`)}`}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(event) => {
                setFilter(event.target.value);
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <AccountList filter={filter} />
      </Container>
      <Link to="/scan">
        <Fab aria-label="Scan" className={classes.fab} color="primary">
          <CropFreeIcon />
        </Fab>
      </Link>
    </div>
  );
};

export default Home;
