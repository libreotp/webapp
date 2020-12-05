import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

import TokenGet from '../../TokenGet';

type Props = {
  account: UserAccount;
  showSelectBar: boolean;
  selectedAccounts: number[];
  setSelectedAccounts: (value: React.SetStateAction<number[]>) => void;
};

const AccountListItem = ({
  account,
  showSelectBar,
  selectedAccounts,
  setSelectedAccounts,
}: Props): JSX.Element => {
  const [trigger, setTrigger] = useState<boolean>(false);

  const handleChange = (event: any) => {
    const value = Number.parseInt(event.target.value);
    const newSelectedAccounts = selectedAccounts.includes(value)
      ? selectedAccounts.filter((accountId) => accountId !== value)
      : [...selectedAccounts, value];
    setSelectedAccounts(newSelectedAccounts);
  };

  return (
    <ListItem
      button
      onClick={(): void => {
        setTrigger(true);
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <TimelapseIcon />
        </Avatar>
      </ListItemAvatar>
      {trigger ? (
        <TokenGet account={account} setTrigger={setTrigger} />
      ) : (
        <ListItemText
          primary={account.label.issuer || account.query.issuer}
          secondary={account.label.account}
        />
      )}
      {showSelectBar ? (
        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            onChange={handleChange}
            checked={selectedAccounts.includes(account.id)}
            value={account.id}
          />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default AccountListItem;
