import React, { useState, useEffect } from 'react';
import { authenticator } from 'otplib';
import ListItemText from '@material-ui/core/ListItemText';

type Props = {
  account: UserAccount;
  setTrigger: (value: React.SetStateAction<boolean>) => void;
};

const TokenGet = ({ account, setTrigger }: Props): JSX.Element => {
  const [token, setToken] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(
    authenticator.timeRemaining()
  );

  useEffect(() => {
    if (account.query.secret) {
      setToken(authenticator.generate(account.query.secret));
    }
  }, [account]);

  useEffect(() => {
    if (timeLeft === 30) {
      setToken(null);
      setTrigger(false);
    }
  }, [account, timeLeft, setTrigger]);

  useEffect(() => {
    const timing = setInterval(() => {
      setTimeLeft(authenticator.timeRemaining());
    }, 1000);

    return () => {
      clearInterval(timing);
    };
  }, []);

  return <ListItemText primary={token} secondary="" />;
};

export default TokenGet;
