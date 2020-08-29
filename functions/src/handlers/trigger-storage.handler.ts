import { EventContext } from 'firebase-functions';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

import { BucketFile } from '../models/file';
import { UserId } from '../models/user-id';

export const triggerStorageHandler = async (object: ObjectMetadata, context: EventContext) => {
  const pathFile = object.name;
  const file = new BucketFile(object.name);
  const userUID = object.name.split('/')[1];
  await file.download();
  switch (pathFile) {
    case `users/${userUID}/INE`:
      return new UserId(userUID, file.tempPathName).store();
    case `users/${userUID}/REVERSE_INE`:
      return new UserId(userUID, file.tempPathName).storeReverse();
    default:
      return null;
  }
};
