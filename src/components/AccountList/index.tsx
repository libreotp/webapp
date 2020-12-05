import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import AccountListItem from './Item';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    notFound: {
      textAlign: 'center',
    },
    list: {
      backgroundColor: theme.palette.background.paper,
    },
  })
);

type Props = {
  accounts: UserAccount[];
  showSelectBar: boolean;
  filter: string;
  selectedAccounts: number[];
  setSelectedAccounts: (value: React.SetStateAction<number[]>) => void;
};

const AccountList = ({
  accounts,
  filter,
  showSelectBar,
  selectedAccounts,
  setSelectedAccounts,
}: Props): JSX.Element => {
  const classes = useStyles();

  const filteredAccounts = accounts.filter((account) => {
    return (
      account.label.account.toLowerCase().includes(filter.toLowerCase()) ||
      account.label.issuer?.toLowerCase().includes(filter.toLowerCase()) ||
      account.query.issuer?.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <div className={classes.root}>
      {!!filteredAccounts.length && (
        <List className={classes.list}>
          {filteredAccounts.map((account: UserAccount) => (
            <AccountListItem
              key={account.id}
              account={account}
              showSelectBar={showSelectBar}
              selectedAccounts={selectedAccounts}
              setSelectedAccounts={setSelectedAccounts}
            />
          ))}
        </List>
      )}
      {!!accounts.length && !filteredAccounts.length && (
        <Typography variant="body1" className={classes.notFound}>
          <Trans>No account found</Trans>
        </Typography>
      )}
      {!accounts.length && (
        <div className={classes.notFound}>
          <Typography variant="body1">
            <Trans>You don't have any accounts yet</Trans>
          </Typography>
          <Link to="/scan">
            <Button color="primary">
              <Trans>Scan QR code</Trans>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AccountList;
