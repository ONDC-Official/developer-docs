import * as _sodium from 'libsodium-wrappers';
import * as _ from 'lodash';
import {
  GenericObject,
  ICreateAuthorizationHeader,
  ICreateSigningString,
  IHeaderParts,
  ISignMessage,
  IVerifyHeader,
  IVerifyMessage,
  IsSignatureValid,
} from '../types';

export const createSigningString = async ({ message, created, expires }: ICreateSigningString) => {
  if (!created) created = Math.floor(new Date().getTime() / 1000).toString();
  if (!expires) expires = (parseInt(created, 10) + 1 * 60 * 60).toString();

  await _sodium.ready;

  const sodium = _sodium;
  const digest = sodium.crypto_generichash(64, sodium.from_string(message));
  const digestBase64 = sodium.to_base64(digest, _sodium.base64_variants.ORIGINAL);

  const signingString = `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digestBase64}`;

  return { signingString, created, expires };
};

export const signMessage = async ({ signingString, privateKey }: ISignMessage) => {
  await _sodium.ready;
  const sodium = _sodium;

  const signedMessage = sodium.crypto_sign_detached(
    signingString,
    sodium.from_base64(privateKey, _sodium.base64_variants.ORIGINAL),
  );
  return sodium.to_base64(signedMessage, _sodium.base64_variants.ORIGINAL);
};

export const createAuthorizationHeader = async ({
  body,
  privateKey,
  subscriberId,
  subscriberUniqueKeyId,
  expires,
  created,
}: ICreateAuthorizationHeader) => {
  const {
    signingString,
    expires: expiresT,
    created: createdT,
  } = await createSigningString({
    message: JSON.stringify(body),
    created,
    expires,
  });

  const signature = await signMessage({ signingString, privateKey });

  const header = `Signature keyId="${subscriberId}|${subscriberUniqueKeyId}|ed25519",algorithm="ed25519",created="${createdT}",expires="${expiresT}",headers="(created) (expires) digest",signature="${signature}"`;
  return header;
};

const removeQuotes = (a: string) => {
  return a.replace(/^["'](.+(?=["']$))["']$/, '$1');
};

const splitAuthHeader = (authHeader: string): GenericObject | IHeaderParts => {
  const header = authHeader.replace('Signature ', '');
  const re = /\s*([^=]+)=([^,]+)[,]?/g;
  let m: any;
  const parts: GenericObject = {};
  /* tslint:disable-next-line */
  while ((m = re.exec(header)) !== null) {
    if (m) {
      parts[m[1]] = removeQuotes(m[2]);
    }
  }
  return parts;
};

const verifyMessage = async ({ signedString, signingString, publicKey }: IVerifyMessage) => {
  try {
    await _sodium.ready;
    const sodium = _sodium;
    return sodium.crypto_sign_verify_detached(
      sodium.from_base64(signedString, _sodium.base64_variants.ORIGINAL),
      signingString,
      sodium.from_base64(publicKey, _sodium.base64_variants.ORIGINAL),
    );
  } catch (error) {
    return false;
  }
};

const verifyHeader = async ({ headerParts, body, publicKey }: IVerifyHeader) => {
  const { signingString } = await createSigningString({
    message: JSON.stringify(body),
    created: headerParts?.created,
    expires: headerParts?.expires,
  });
  const verified = await verifyMessage({
    signedString: headerParts?.signature,
    signingString,
    publicKey,
  });
  return verified;
};

export const isSignatureValid = async ({ header, body, publicKey }: IsSignatureValid) => {
  try {
    const headerParts = splitAuthHeader(header);
    const keyIdSplit = headerParts?.keyId?.split('|');
    const subscriberId = keyIdSplit[0];
    const keyId = keyIdSplit[1];

    const isValid = await verifyHeader({ headerParts: headerParts as IHeaderParts, body, publicKey });
    return isValid;
  } catch (e) {
    return false;
  }
};
