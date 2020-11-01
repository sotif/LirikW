export interface Comment {
  id: string;
  createdAt: string;
  contentOffsetSeconds: number;
  commenter: Commenter;
  messageContent: MessageContent;
}

export interface Commenter {
  displayName: string;
}

export interface MessageContent {
  body: string;
  emotes: Emote[];
  userColor: string;
}

export interface Emote {
  id: string;
  begin: number;
  end: number;
}


