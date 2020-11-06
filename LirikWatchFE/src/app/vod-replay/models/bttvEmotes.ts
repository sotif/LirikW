export interface BttvEmoteResp {
  id: ID;
  bots: any[];
  channelEmotes: Emote[];
  sharedEmotes: Emote[];
}

export interface Emote {
  id: string;
  code: string;
  imageType: ImageType;
  userId?: ID;
  user?: User;
}

export enum ImageType {
  GIF = 'gif',
  PNG = 'png',
}

export interface User {
  id: string;
  name: string;
  displayName: string;
  providerId: string;
}

export enum ID {
  The55Ae669B911D882C66Cfbfd8 = '55ae669b911d882c66cfbfd8',
}
