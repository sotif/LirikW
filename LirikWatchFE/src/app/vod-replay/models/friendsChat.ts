export interface ChatReply {
  body: string;
  offset: number;
  commenter: Commenter;
  data: Data;
  emotes: Emote[];
  badges: Badge[];
  badgeUrls?: string[];
}

export interface Badge {
  id: string;
  version: string;
}

export interface Commenter {
  displayName: string;
}

export interface Data {
  userColor?: string;
}

export interface Emote {
  id: string;
  text: string;
  setId: string;
}
