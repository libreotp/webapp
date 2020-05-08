type UserAccount = {
  id: number;
  text: string;
  type: 'totp' | 'hotp';
  label: {
    account: string;
    issuer?: string;
  };
  query: {
    secret: string;
    issuer?: string;
    algorithm?: string;
    digits?: number;
    period?: number;
  };
};

type Key = {
  type: 'totp' | 'hotp';
  label: {
    account: string;
    issuer?: string;
  };
  query: {
    secret: string;
    issuer?: string;
    algorithm?: string;
    digits?: number;
    period?: number;
  };
};

type UserMedia = {
  stream: MediaStream | null;
  error: MediaStreamError | null;
};
