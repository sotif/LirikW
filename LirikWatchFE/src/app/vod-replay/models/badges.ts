export interface ChannelBadges {
  badge_sets: BadgeSets;
}

export interface BadgeSets {
  bits: Bits;
  subscriber: Bits;
}

export interface Bits {
  versions: { [key: string]: Version };
}

export interface Version {
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  description: string;
  title: string;
  click_action: ClickAction;
  click_url: string;
  last_updated: Date | null;
}

export enum ClickAction {
  SubscribeToChannel = 'subscribe_to_channel',
  VisitURL = 'visit_url',
}
