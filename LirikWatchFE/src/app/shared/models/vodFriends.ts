import {GamesMeta, VodMetadata} from './video';
import {Video} from './filters';

export interface VodMeta {
  guid: string;
  id: number;
  youTubeId?: string;
  games: GameMeta[];
  data: VodData;
}

export interface VodData {
  title: string;
  game?: string;
  lengthSeconds: number;
  quality: string;
  recordedAt: Date;
}

export interface GameMeta {
  game: VGame;
  durationMilliseconds: number;
  positionMilliseconds: number;
}

export interface VGame {
  name: string;
  boxArtUrl: string;
  id?: number;
}

const vodMetaToInternal = (meta: VodMeta): VodMetadata => ({
  video: vodMetaToInternalVideo(meta),
  games: meta.games.map(x => vGameToInternal(x))
});

const vodMetaToInternalVideo = (meta: VodMeta): Video => ({
  id: meta.id.toString(),
  title: meta.data.title,
  ytId: meta.youTubeId,
  createdAt: meta.data.recordedAt,
  lengthInSeconds: meta.data.lengthSeconds,
  videoGuid: meta.guid
});

const vGameToInternal = (g: GameMeta): GamesMeta => ({
  title: g.game.name,
  id: g.game.id?.toString(),
  boxArtUrl: g.game.boxArtUrl,
  positionMilliseconds: g.positionMilliseconds,
  durationMilliseconds: g.durationMilliseconds
});

export {vodMetaToInternal, vGameToInternal, vodMetaToInternalVideo};
