import { NewsRepository } from '../../blog/news/application/NewsRepository';
import { Email } from './EmailSendRepository';
import { IncomeEmailStrategy } from '../application/IncomeEmailStrategy';
import { getImages } from '../../shared/regex';

export class ContentMailStrategy implements IncomeEmailStrategy {
  constructor(private newsRepository: NewsRepository) {}

  async execute(email: Email): Promise<void> {
    const sourceNameFromEmail = email.from.match(/.*(?= <)/)[0].replace(/"/g, '');
    const image = await getImages(email.body);
    await this.newsRepository.save([
      {
        source: {
          name: sourceNameFromEmail,
        },
        title: email.subject,
        description: email.body,
        url: `mailto:${email.from}`,
        urlToImage: image || '',
        publishedAt: new Date(),
        type: 'newspaper',
      },
    ]);
  }
}
