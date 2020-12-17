import React, { useState, useEffect } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import CropFreeIcon from '@material-ui/icons/CropFree';
import { Link } from 'react-router-dom';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';

import AccountList from '../../components/AccountList';
import { openDatabase } from '../../utils/idb';
import { decrypt } from '../../utils/crypto';

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
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const Home: React.FC = () => {
  const classes = useStyles();

  const { i18n } = useLingui();

  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [showSelectBar, setShowSelectBar] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');

  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = () => {
    setShowSelectBar(true);
    setAnchorEl(null);
  };

  const handleSelectCancel = () => {
    setShowSelectBar(false);
    setAnchorEl(null);
  };

  const decryptedAccount = async (
    encryptedAccounts: any
  ): Promise<UserAccount[]> => {
    const database = await openDatabase();
    const key = await database.get('keys', 1);

    if (!key) {
      return [];
    }

    return Promise.all(
      encryptedAccounts.map(async (encryptedAccount: any) => {
        const data = await decrypt(
          encryptedAccount.iv,
          key,
          encryptedAccount.data
        );
        data.id = encryptedAccount.id;
        return data;
      })
    );
  };

  const handleDelete = async () => {
    const database = await openDatabase();
    const transaction = database.transaction('accounts', 'readwrite');
    const store = transaction.objectStore('accounts');
    await Promise.all(
      selectedAccounts.map((accountId) => store.delete(accountId))
    );
    const encryptedAccounts = await store.getAll();
    await transaction.done;

    const accounts = await decryptedAccount(encryptedAccounts);

    setAccounts(accounts);

    setShowSelectBar(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    async function getAccounts() {
      const database = await openDatabase();
      const transaction = database.transaction('accounts', 'readonly');
      const store = transaction.objectStore('accounts');
      const encryptedAccounts = await store.getAll();
      await transaction.done;

      const accounts = await decryptedAccount(encryptedAccounts);

      setAccounts(accounts);
    }

    getAccounts();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          {showSelectBar ? (
            <>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <CloseIcon onClick={handleSelectCancel} />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {selectedAccounts.length
                  ? `${selectedAccounts.length} ${i18n._(t`selected`)}`
                  : `${i18n._(t`Select accounts`)}`}
              </Typography>
            </>
          ) : null}
          {accounts.length && !showSelectBar ? (
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
          ) : null}
          {!accounts.length && !anchorEl ? (
            <Typography variant="h6" className={classes.title}>
              LibreOTP
            </Typography>
          ) : null}
          {accounts.length ? (
            <>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                edge="end"
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
              <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleMenuClose}
              >
                {!showSelectBar ? (
                  <MenuItem key="select" onClick={handleSelect}>
                    <Trans>Select</Trans>
                  </MenuItem>
                ) : (
                  <MenuItem key="select" onClick={handleDelete}>
                    <Trans>Delete</Trans>
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <AccountList
          accounts={accounts}
          filter={filter}
          showSelectBar={showSelectBar}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
        />
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
