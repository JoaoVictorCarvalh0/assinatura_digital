import crypto from 'crypto';

export function generateRSAKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
}

export function sha256Hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function signHash(hash, privateKey) {
  return crypto.sign('sha256', Buffer.from(hash, 'hex'), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  }).toString('base64');
}

export function verifySignature(hash, signature, publicKey) {
  return crypto.verify(
    'sha256',
    Buffer.from(hash, 'hex'),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(signature, 'base64')
  );
}
