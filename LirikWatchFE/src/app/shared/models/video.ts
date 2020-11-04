import {Video} from './filters';

export interface YtId {
  id: string;
}

export interface VodMetadata {
  video: Video;
  games: GamesMeta[];
}

export interface GamesMeta {
  durationMilliseconds: number;
  positionMilliseconds: number;
  id: string;
  title: string;
  boxArtUrl: string;
}
