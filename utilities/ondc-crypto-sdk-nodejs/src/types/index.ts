export interface ICreateSigningString {
  message: string;
  created?: string;
  expires?: string;
}

export interface ISignMessage {
  signingString: string;
  privateKey: string;
}

export interface GenericObject {
  [key: string]: any;
}

export interface IVerifyMessage {
  signedString: string;
  signingString: string;
  publicKey: string;
}

export interface IHeaderParts {
  expires: string;
  created: string;
  keyId: string;
  signature: string;
  [key: string]: any;
}

export interface IVerifyHeader {
  headerParts: IHeaderParts;
  body: string;
  publicKey: string;
}

export interface IsSignatureValid {
  header: string;
  body: any;
  publicKey: string;
}
export interface ICreateAuthorizationHeader {
  message: GenericObject;
  privateKey: string;
  bapId: string;
  bapUniqueKeyId: string;
  expires?: string;
  created?: string;
}
