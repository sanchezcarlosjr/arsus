export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface ResourceId {
  kind: string;
  channelId: string;
}

export interface Default {
  url: string;
}

export interface Medium {
  url: string;
}

export interface High {
  url: string;
}

export interface Thumbnails {
  default: Default;
  medium: Medium;
  high: High;
}

export interface Snippet {
  publishedAt: Date;
  title: string;
  description: string;
  resourceId: ResourceId;
  channelId: string;
  thumbnails: Thumbnails;
}

export interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
}

export interface YoutubeResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: PageInfo;
  items: Item[];
}
