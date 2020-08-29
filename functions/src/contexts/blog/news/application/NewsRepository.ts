import { Article } from '../domain/Article';

export interface NewsRepository {
  save(articles: Article[]): Promise<void>;
}
