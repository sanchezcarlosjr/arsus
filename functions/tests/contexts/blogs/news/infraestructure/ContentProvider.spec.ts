import { expect } from 'chai';
import * as mocha from 'mocha';
import * as moment from 'moment';
import { NewsCreator } from '../../../../../src/contexts/blog/news/application/NewsCreator';
import { Article } from '../../../../../src/contexts/blog/news/domain/Article';
import { FirestoreNewsSaveRepository } from '../../../../../src/contexts/blog/news/infraestructure/FirestoreNewsSaveRepository';
import { HackerNews } from '../../../../../src/contexts/blog/news/infraestructure/HackerNews';
import { Music } from '../../../../../src/contexts/blog/news/infraestructure/Music';
import { NewsApi } from '../../../../../src/contexts/blog/news/infraestructure/NewsApi';
import { Podcast } from '../../../../../src/contexts/blog/news/infraestructure/Podcast';
import { Twitter } from '../../../../../src/contexts/blog/news/infraestructure/Twitter';
import { Youtube } from '../../../../../src/contexts/blog/news/infraestructure/Youtube';
import { ContentMailStrategy } from '../../../../../src/contexts/email/domain/ContentMailStrategy';
import { AdminWrapper } from '../../../../AdminWrapper';
import sinon = require('sinon');

const isValidSetDocuments = (actual: Article[]): boolean => {
  const start = moment().subtract(30, 'minutes');
  const now = new Date();
  const insecureLinksPattern = /['"]http?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+['"]/g;
  const insecureSymbols = /"/g;
  actual.forEach((article) => {
    if (insecureLinksPattern.test(article.urlToImage)) {
      throw Error(`Cannot use this article by insecure image`);
    }
    for (const value of Object.values(article)) {
      if (value === undefined) {
        console.log(article);
        throw Error(`Cannot use "undefined" as a Firestore value (found in field "").`);
      }
    }
    if (insecureSymbols.test(article.source.name)) {
      throw Error(`Cannot use " as a Firestore value (found in field source's name).`);
    }
    if (!(article.publishedAt instanceof Date)) {
      console.log(article);
      throw Error(`Cannot use ${article.publishedAt} as a publishedAt property. It should type Date`);
    }
    if (!moment(article.publishedAt).isBetween(start, now)) {
      console.log(article);
      throw Error(`The ${article.type} must have published at (${article.publishedAt}) last 8 hours.`);
    }
  });
  return actual.length > 0;
};

mocha.describe('Content Provider', () => {
  const admin = new AdminWrapper();
  admin.setRealEnvironment(false);
  it('should save batch news', async () => {
    const newsDatabaseRepository = sinon.createStubInstance(FirestoreNewsSaveRepository);
    newsDatabaseRepository.save.resolves();
    const newsCreator = new NewsCreator(newsDatabaseRepository);
    await newsCreator.create([new Podcast()]);
    sinon.assert.calledWith(newsDatabaseRepository.save, sinon.match(isValidSetDocuments));
  });
  it('should request to News Api and return with articles format', async () => {
    const newsApi = new NewsApi();
    const articles = await newsApi.run();
    expect(isValidSetDocuments(articles)).to.equal(true);
  });
  it('should request to Hackers News Api and return with articles format', async () => {
    const hackerNews = new HackerNews();
    const articles = await hackerNews.run();
    expect(isValidSetDocuments(articles)).to.equal(true);
  });
  it('should request to Twitter Api and return with articles format', async () => {
    const twitter = new Twitter();
    const articles = await twitter.run();
    expect(isValidSetDocuments(articles)).to.equal(true);
  });
  it('should request to Music Api and return with articles format', async () => {
    const music = new Music();
    const articles = await music.run();
    expect(isValidSetDocuments(articles)).to.equal(true);
  });
  it('should request to Podcast Api and return with articles format', async () => {
    const podcast = new Podcast();
    const articles = await podcast.run();
    expect(isValidSetDocuments(articles)).to.equal(true);
  });
  it('should request to Youtube Api and return with articles format', async () => {
    const youtube = new Youtube();
    const articles = await youtube.run();
    expect(isValidSetDocuments(articles)).to.equal(true);
  });
  it('should save emails with articles format', async () => {
    const body = `
    https://cdn-m4m.chd01.com/pro/uploads/account_755/225422/gradient.png
    <img src="https://cdn-m4m.chd01.com/pro/uploads/account_755/226992/600_Decider_Netflix_Newsletter_HeaderImage_2x.png" width="420" height="175" alt="DECIDER LOGO" border="0" hspace="0" vspace="0" style="display:block; max-width: 100%;height: auto;">
    <img src="https://cdn-m4m.chd01.com/pro/uploads/account_755/226992/600_Decider_Netflix_Newsletter_HeaderImage_2x.png" width="420" height="175" alt="DECIDER LOGO" border="0" hspace="0" vspace="0" style="display:block; max-width: 100%;height: auto;">
    `;
    const newsDatabaseRepository = sinon.createStubInstance(FirestoreNewsSaveRepository);
    newsDatabaseRepository.save.resolves();
    const contentMailStrategy = new ContentMailStrategy(newsDatabaseRepository);
    await contentMailStrategy.execute({
      from: '"MIT Technology Review" <newsletters@technologyreview.com>',
      to: '',
      subject: '',
      text: '',
      body,
    });
    sinon.assert.calledWith(newsDatabaseRepository.save, sinon.match(isValidSetDocuments));
  });
});
