import { useState, useEffect, useMemo } from 'react';

const useUserMedia = (constraints: MediaStreamConstraints): UserMedia => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<MediaStreamError | null>(null);

  useEffect(() => {
    if (stream) {
      return;
    }

    let canceled = false;

    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!canceled) {
          setStream(stream);
        }
      } catch (err) {
        if (!canceled) {
          setError(err);
        }
      }
    };

    getUserMedia();

    return () => {
      canceled = true;

      if (!stream) {
        return;
      }

      (stream as MediaStream).getTracks().map((track) => track.stop());
    };
  }, [constraints, stream, error]);

  const memoizedValue = useMemo(
    () => ({
      stream,
      error,
    }),
    [stream, error]
  );

  return memoizedValue;
};

export default useUserMedia;
