import { Article } from '../domain/Article';

export interface CreatorContentProvider {
  run(): Promise<Article[]>;
}
