export interface TypeCommunicationFinderRepository {
  find(id: string): Promise<string>;
}
