import bugsnag from './bugsnag';

function keyUriParser(uri: string): Key | null {
  try {
    if (!uri.match(/^otpauth:/i)) {
      return null;
    }

    // Hack to fix URL parsing
    uri = uri.replace(/^otpauth/i, 'http');

    const url = new URL(uri);

    const type = url.host.toLowerCase();

    if (
      (type !== 'hotp' && type !== 'totp') ||
      !url.searchParams.get('secret') ||
      (type === 'hotp' &&
        (!url.searchParams.get('counter') || !url.searchParams.get('period')))
    ) {
      return null;
    }

    const pathnameSplit = decodeURIComponent(url.pathname).split(/: ?/);

    let issuer = '';
    if (url.searchParams.has('issuer')) {
      issuer = url.searchParams.get('issuer') || '';
    } else if (pathnameSplit.length === 2) {
      issuer = pathnameSplit[0].substr(1);
    }

    let account = '';
    if (pathnameSplit.length === 1) {
      account = pathnameSplit[0].substr(1);
    } else if (pathnameSplit.length === 2) {
      account = pathnameSplit[1];
    }

    const query: {
      secret: string;
      issuer?: string;
      algorithm?: string;
      digits?: number;
      counter?: number;
      period?: number;
    } = {
      secret: String(url.searchParams.get('secret')),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    };

    if (url.searchParams.has('issuer')) {
      query.issuer = String(url.searchParams.get('issuer'));
    }
    if (url.searchParams.has('algorithm')) {
      query.algorithm = String(url.searchParams.get('algorithm'));
    }
    if (url.searchParams.has('digits')) {
      query.digits = Number(url.searchParams.get('digits'));
    }
    if (type === 'hotp' && url.searchParams.has('counter')) {
      query.counter = Number(url.searchParams.get('counter'));
    }
    if (type === 'hotp' || url.searchParams.has('period')) {
      query.period = Number(url.searchParams.get('period'));
    }

    return {
      type,
      label: {
        issuer,
        account,
      },
      query,
    };
  } catch (error) {
    bugsnag.notify(error);
    return null;
  }
}

export default keyUriParser;
