export interface Article {
  source?: Source;
  author?: string;
  title?: string;
  description?: string;
  url?: string;
  styles?: any;
  audio?: string;
  urlToImage?: string;
  publishedAt?: Date;
  type?: string;
}

export interface Source {
  id?: string;
  name: string;
}
