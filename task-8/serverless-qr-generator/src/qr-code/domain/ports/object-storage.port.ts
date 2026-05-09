export interface PutPublicObjectParams {
  key: string;
  body: Buffer;
  contentType: string;
}

export interface PutPublicObjectResult {
  publicUrl: string;
}

export interface IObjectStorage {
  putPublicObject(
    params: PutPublicObjectParams,
  ): Promise<PutPublicObjectResult>;
}
