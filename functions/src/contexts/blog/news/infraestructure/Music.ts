import { CreatorContentProvider } from '../application/CreatorContentProvider';
import { Article } from '../domain/Article';
import { Database } from '../../../../database/database';

const request = require('request-promise');

export interface Artist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  tracklist: string;
  type: string;
}

export interface Datum {
  id: number;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  position: number;
  artist: Artist;
  album: Album;
  type: string;
}

export interface MusicResponse {
  data: Datum[];
  total: number;
}

export class Music implements CreatorContentProvider {
  private options = {
    uri: `https://api.deezer.com/chart/0/tracks`,
    json: true,
  };

  public async run(): Promise<Article[]> {
    const database = new Database();
    database.collection('content');
    const articles: Article[] = [];
    const response: MusicResponse = await request(this.options);
    await Promise.all(
      response.data.map(async (item) => {
        const data = await database.whereData('title', '==', item.title);
        if (data.length === 0) {
          articles.push({
            source: {
              name: item.artist.name,
            },
            title: item.title,
            description: `álbum: ${item.album.title}`,
            url: item.link,
            urlToImage: item.album.cover_big,
            audio: item.preview,
            publishedAt: new Date(),
            type: 'podcast',
          });
        }
      })
    );
    return articles;
  }
}
