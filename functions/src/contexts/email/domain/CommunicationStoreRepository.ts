export interface Communication {
  from: string;
  to: string;
  body: string;
  extra?: any;
}

export interface CommunicationStoreRepository {
  save(communication: Communication): Promise<void>;
}
