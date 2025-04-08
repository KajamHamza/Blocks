/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageClient } from "@lens-chain/storage-client";

const storageClient = StorageClient.create();

export const uploadJson = async (data: any) => {
  const result = await storageClient.uploadAsJson(data);
  return { uri: result };
};
