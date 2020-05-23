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

function toBase64(buffer: ArrayBuffer): string {
  return btoa(
    new Uint8Array(buffer).reduce(
      (previous, current) => previous + String.fromCharCode(current),
      ''
    )
  );
}

export async function encrypt(
  key: CryptoKey,
  data: any
): Promise<{ iv: string; data: string }> {
  const bufferIv = window.crypto.getRandomValues(new Uint8Array(12));
  const bufferData = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    bufferData
  );

  return {
    iv: toBase64(bufferIv),
    data: toBase64(encrypted),
  };
}

function fromBase64(string: string): Uint8Array {
  return Uint8Array.from(atob(string), (char) => char.charCodeAt(0));
}

export async function decrypt(
  iv: string,
  key: CryptoKey,
  data: string
): Promise<UserAccount> {
  const bufferIv = fromBase64(iv);
  const bufferData = fromBase64(data);
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: bufferIv,
    },
    key,
    bufferData
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}
