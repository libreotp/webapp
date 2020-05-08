import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import AccountListItem from './Item';
import { openDatabase } from '../../utils/idb';
import { decrypt } from '../../utils/crypto';

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
  filter: string;
};

const AccountList = ({ filter }: Props): JSX.Element => {
  const classes = useStyles();

  const [accounts, setAccounts] = useState<UserAccount[]>([]);

  useEffect(() => {
    async function getAccounts() {
      const database = await openDatabase();
      const key = await database.get('keys', 1);

      if (key) {
        const transaction = database.transaction('accounts', 'readonly');
        const store = transaction.objectStore('accounts');
        const encryptedAccounts = await store.getAll();
        await transaction.done;

        const accounts = await Promise.all(
          encryptedAccounts.map(async (encryptedAccount) => {
            const data = await decrypt(
              encryptedAccount.iv,
              key,
              encryptedAccount.data
            );
            return {
              id: encryptedAccount.id,
              ...data,
            };
          })
        );

        setAccounts(accounts);
      }
    }

    getAccounts();
  }, []);

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
            <AccountListItem key={account.id} account={account} />
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
              <Trans>Scan a QR code</Trans>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AccountList;
