export interface ChatReply {
  body: string;
  offset: number;
  commenter: Commenter;
  data: Data;
  emotes: Emote[];
  badges: Badge[];
}

export interface Badge {
  id: ID;
  version: string;
}

export enum ID {
  Bits = 'bits',
  BitsCharity = 'bits-charity',
  GlhfPledge = 'glhf-pledge',
  HypeTrain = 'hype-train',
  Premium = 'premium',
  SubGifter = 'sub-gifter',
  Subscriber = 'subscriber',
  Vip = 'vip',
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
