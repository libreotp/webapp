import React, { useRef, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import QrScanner from 'qr-scanner';

import { Account } from '../../types';
import history from '../../utils/history';
import useUserMedia from '../../hooks/useUserMedia';
import keyUriParser from '../../utils/keyUriParser';
import { openDatabase } from '../../utils/idb';

import { generateIV, encrypt } from '../../utils/crypto';

QrScanner.WORKER_PATH = '/lib/qr-scanner-worker.min.js';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      color: '#fff',
    },
    video: {
      width: '100%',
    },
  })
);

const Scan: React.FC = () => {
  const classes = useStyles();

  const videoRef = useRef<HTMLVideoElement>(null);

  const media = useUserMedia({
    audio: false,
    video: { facingMode: 'environment' },
  });

  const handleSave = async (text: string): Promise<void> => {
    const result = keyUriParser(text);

    if (result) {
      const database = await openDatabase();
      const key = await database.get('keys', 1);
      const iv = generateIV();

      // @ts-ignore property id will be auto set
      const account: Account = {
        text,
        ...result,
      };

      if (key) {
        const data = await encrypt(iv, key, account);

        const transaction = database.transaction('accounts', 'readwrite');
        const store = transaction.objectStore('accounts');

        // @ts-ignore property id will be auto set
        await store.add({
          iv,
          data,
        });

        await transaction.done;
      }
    }

    return history.push('/');
  };

  useEffect(() => {
    if (!videoRef.current || !('srcObject' in videoRef.current)) {
      return;
    }

    if (media.stream) {
      videoRef.current.srcObject = media.stream;
    }

    const scanner = new QrScanner(videoRef.current, (result: any) =>
      handleSave(result)
    );

    scanner.start();

    return () => {
      scanner.destroy();
    };
  }, [videoRef, media]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Link className={classes.link} to="/">
            <IconButton color="inherit" aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      {!media.stream || media.error ? (
        <p>You need to allow access to the camera to scan qrcodes.</p>
      ) : (
        <video
          className={classes.video}
          autoPlay
          muted
          playsInline
          ref={videoRef}
        />
      )}
    </>
  );
};

export default Scan;
