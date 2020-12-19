import React, { useRef, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { Trans, t } from '@lingui/macro';

import history from '../../utils/history';
import useUserMedia from '../../hooks/useUserMedia';
import keyUriParser from '../../utils/keyUriParser';
import { openDatabase } from '../../utils/idb';
import { encrypt } from '../../utils/crypto';

QrScanner.WORKER_PATH = '/lib/qr-scanner-worker.min.js';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      color: '#fff',
    },
    video: {
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
    },
    square: {
      position: 'absolute',
      border: '2px solid #3f51b5',
      top: 'calc(10% + 62px)',
      right: '10%',
      bottom: '10%',
      left: '10%',
      animation: '$beam 1s infinite',
    },
    '@keyframes beam': {
      '50%': {
        opacity: 0.5,
      },
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

      // @ts-ignore property id will be auto set
      const account: UserAccount = {
        text,
        ...result,
      };

      if (key) {
        const { iv, data } = await encrypt(key, account);

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
      <AppBar position="fixed">
        <Toolbar>
          <Link className={classes.link} to="/">
            <IconButton color="inherit" aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <Snackbar open={true} message={t`Scanning QR code...`} />
      {!media.stream || media.error ? (
        <p>
          <Trans>You need to allow access to the camera to scan QR codes</Trans>
          .
        </p>
      ) : (
        <>
          <video
            className={classes.video}
            autoPlay
            muted
            playsInline
            ref={videoRef}
          />
          <div className={classes.square}></div>
        </>
      )}
    </>
  );
};

export default Scan;
