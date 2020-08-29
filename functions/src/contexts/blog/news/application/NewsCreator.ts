import { NewsRepository } from './NewsRepository';
import { CreatorContentProvider } from './CreatorContentProvider';
import { Article } from '../domain/Article';

export class NewsCreator {
  constructor(private repository: NewsRepository) {}
  async create(contents: CreatorContentProvider[]): Promise<void> {
    const articles: Article[] = [];
    await Promise.all(contents.map(async (content) => articles.push(...(await content.run()))));
    await this.repository.save(articles);
  }
}
