import keyUriParser from '../utils/keyUriParser';

type keyUriParserTestTuple = [string, Key | null];

const uriList: keyUriParserTestTuple[] = [
  // Valid TOTP
  [
    'otpauth://totp/Test:test@test.tld?secret=abcdefghijklmnopqrstuvwxyz&issuer=Test&algorithm=SHA1&digits=6&period=30',
    {
      type: 'totp',
      label: {
        account: 'test@test.tld',
        issuer: 'Test',
      },
      query: {
        algorithm: 'SHA1',
        digits: 6,
        issuer: 'Test',
        period: 30,
        secret: 'abcdefghijklmnopqrstuvwxyz',
      },
    },
  ],
  // URL encoded
  [
    'otpauth://totp/Test:test%40test.tld?secret=abcdefghijklmnopqrstuvwxyz&issuer=Test&algorithm=SHA1&digits=6&period=30',
    {
      type: 'totp',
      label: {
        account: 'test@test.tld',
        issuer: 'Test',
      },
      query: {
        algorithm: 'SHA1',
        digits: 6,
        issuer: 'Test',
        period: 30,
        secret: 'abcdefghijklmnopqrstuvwxyz',
      },
    },
  ],
  // Valid HOTP
  [
    'otpauth://hotp/Test:test%40test.tld?secret=abcdefghijklmnopqrstuvwxyz&issuer=Test&algorithm=SHA256&digits=6&period=30&counter=0',
    {
      type: 'hotp',
      label: {
        account: 'test@test.tld',
        issuer: 'Test',
      },
      query: {
        algorithm: 'SHA256',
        counter: 0,
        digits: 6,
        issuer: 'Test',
        period: 30,
        secret: 'abcdefghijklmnopqrstuvwxyz',
      },
    },
  ],
  // Invalid protocol
  [
    'otpauth-invalid://totp/Test:test@test.tld?secret=abcdefghijklmnopqrstuvwxyz&issuer=Test&algorithm=SHA1&digits=6&period=30',
    null,
  ],
  // Invalid secret
  [
    'otpauth://totp/Test:test@test.tld?secret&issuer=Test&algorithm=SHA1&digits=6&period=30',
    null,
  ],
];

describe('Key URI parser', () => {
  it.each(uriList)(
    'should output correct values',
    async (uri: string, expectedOutput: Key | null) => {
      const output = keyUriParser(uri);
      return expect(output).toEqual(expectedOutput);
    }
  );
});
