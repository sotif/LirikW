export interface FfzEmoteResp {
  room: Room;
  sets: Sets;
}

export interface Room {
  _id: number;
  css: null;
  display_name: string;
  id: string;
  is_group: boolean;
  mod_urls: null;
  moderator_badge: null;
  set: number;
  twitch_id: number;
  user_badges: any;
}

export interface Sets {
  '135169': The135169;
}

export interface The135169 {
  _type: number;
  css: null;
  description: null;
  emoticons: Emoticon[];
  icon: null;
  id: number;
  title: string;
}

export interface Emoticon {
  css: null;
  height: number;
  hidden: boolean;
  id: number;
  margins: null;
  modifier: boolean;
  name: string;
  offset: null;
  owner: Owner;
  public: boolean;
  urls: { [key: string]: string };
  width: number;
}

export interface FfzEmoteShort {
  height: number;
  id: number;
  name: string;
  url: string;
  width: number;
}

const emoteToShort = (em: Emoticon): FfzEmoteShort => ({
  height: em.height,
  id: em.id,
  name: em.name,
  url: 'https:' + em.urls['1'],
  width: em.width
});

export interface Owner {
  _id: number;
  display_name: string;
  name: string;
}

export {emoteToShort};
