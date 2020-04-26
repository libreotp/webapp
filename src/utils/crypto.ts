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

function jsonToArrayBuffer(object: any): ArrayBuffer {
  const string = JSON.stringify(object);
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }
  return buffer;
}

export function encrypt(
  iv: Uint8Array,
  key: CryptoKey,
  data: any
): PromiseLike<ArrayBuffer> {
  return window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    jsonToArrayBuffer(data)
  );
}

function arrayBufferToJSON(buffer: ArrayBuffer): any {
  const str = String.fromCharCode.apply(
    null,
    Array.from(new Uint8Array(buffer))
  );
  return JSON.parse(str);
}

export async function decrypt(
  iv: Uint8Array,
  key: CryptoKey,
  data: any
): Promise<any> {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );

  return arrayBufferToJSON(decrypted);
}
