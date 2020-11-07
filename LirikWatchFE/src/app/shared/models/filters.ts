export interface FilterResult {
  filterGames?: Game[];
  filterTitles?: Video[];
  filterDates?: Video[];
}

export interface Game {
  id: string;
  title: string;
  boxArtUrl: string;
}

export interface Video {
  title: string;
  broadcastId?: BigInteger;
  url?: string;
  createdAt: Date;
  id: string;
  lengthInSeconds: number;
  ytId: string;
}

const getYtThumbnail = (ytId: string) => `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

export {getYtThumbnail};
