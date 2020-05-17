export function generateKey(): PromiseLike<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

export function importKey(keyData: JsonWebKey): PromiseLike<CryptoKey> {
  return window.crypto.subtle.importKey('raw', keyData, 'AES-GCM', true, [
    'encrypt',
    'decrypt',
  ]);
}

export function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

function toBase64(buffer: ArrayBuffer) {
  return btoa(
    new Uint8Array(buffer).reduce(
      (previous, current) => previous + String.fromCharCode(current),
      ''
    )
  );
}

export async function encrypt(
  iv: Uint8Array,
  key: CryptoKey,
  data: any
): Promise<string> {
  const buffer = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    buffer
  );

  return toBase64(encrypted);
}

function fromBase64(string: string) {
  return Uint8Array.from(atob(string), (char) => char.charCodeAt(0));
}

export async function decrypt(
  iv: Uint8Array,
  key: CryptoKey,
  data: string
): Promise<UserAccount> {
  const buffer = fromBase64(data);
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    buffer
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}
