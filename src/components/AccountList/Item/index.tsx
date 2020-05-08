import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import TimelapseIcon from '@material-ui/icons/Timelapse';

import TokenGet from '../../TokenGet';

type Props = {
  account: UserAccount;
};

const AccountListItem = ({ account }: Props): JSX.Element => {
  const [trigger, setTrigger] = useState<boolean>(false);

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
    </ListItem>
  );
};

export default AccountListItem;
