export interface Account {
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
}

export interface UserMedia {
  stream: MediaStream | null;
  error: MediaStreamError | null;
}

export interface Key {
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
}
