import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, zip} from 'rxjs';
import {BttvEmoteResp, Emote} from '../models/bttvEmotes';
import {map} from 'rxjs/operators';
import {Badge, Emote as friendEmote} from '../models/friendsChat';
import {emoteToShort, FfzEmoteResp, FfzEmoteShort} from '../models/ffzEmotes';
import {ChannelBadges, Version} from '../models/badges';

@Injectable({
  providedIn: 'root'
})
export class EmoteService {

  private ttvChannelUrl = 'https://badges.twitch.tv/v1/badges/channels/23161357/display';

  private bttvGlobalUrl = 'https://api.betterttv.net/3/cached/emotes/global';
  private bttvChannelUrl = 'https://api.betterttv.net/3/cached/users/twitch/23161357';

  private ffzChannelUrl = 'https://api.frankerfacez.com/v1/room/id/23161357';
  private emoteMap: Map<string, string> = new Map<string, string>();
  private subMap: { [key: string]: Version };

  constructor(
    private http: HttpClient
  ) {
    const bttv = this.getBttvEmotes();
    const ffz = this.getFfzEmotes();
    // Construct emote map
    zip(bttv, ffz)
      .subscribe(([b, z]) => {
        b.forEach(e => {
          this.emoteMap.set(e.code, this.getBttvEmoteUrl(e.id));
        });
        z.forEach(e => {
          this.emoteMap.set(e.name, e.url);
        });
      }, err => {
        console.error(err);
      });

    this.populateBadgeCache();
  }

  private populateBadgeCache(): void {
    this.http.get<ChannelBadges>(this.ttvChannelUrl)
      .subscribe(badges => {
        this.subMap = badges.badge_sets.subscriber.versions;
      }, err => {
        console.error(err);
      });
  }

  public getBadgeUrl(b: Badge): string {
    switch (b.id) {
      case 'moderator':
        return 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1';
      case 'vip':
        return 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1';
      case 'subscriber':
        return this.subMap[b.version].image_url_1x;
      default:
        return null;
    }
  }

  public getBadgeUrls(badges: Badge[]): string[] {
    if (!badges || badges.length === 0) {
      return [];
    }

    const bs: string[] = [];
    badges.forEach(b => {
      const badge = this.getBadgeUrl(b);
      if (!badge) {
        return;
      }
      bs.push(badge);
    });
    return bs;
  }

  public formatCompleteMessage(msg: string, ttvEms: friendEmote[]): string {
    // Adding all the ttv emotes to our global emote map before sending it further
    // That way we dont have to finess around the datastructure and can just brute force it
    if (ttvEms != null && ttvEms.length !== 0) {
      ttvEms.forEach(em => {
        if (!this.emoteMap.has(em.text)) {
          // Add it to the global map
          this.emoteMap.set(em.text, this.getTtvStandardEmoteUrl(em.id));
        }
      });
    }

    // Now send it of to be formatted
    return this.formatMessageWithEmotes(msg);
  }

  public formatMessageWithEmotes(msg: string): string {
    const msgSplit = msg.split(' ');
    let formatted = '';
    msgSplit.forEach(m => {
      const em = this.emoteMap.get(m);
      if (!em) {
        formatted += `${m} `;
      } else {
        formatted += `<img class="emote-image" src="${em}" alt="Emote"/> `;
      }
    });

    return formatted.trim();
  }

  public getBttvEmotes(): Observable<Emote[]> {
    const channelEmotes = this.http.get<BttvEmoteResp>(this.bttvChannelUrl);
    const globalEmotes = this.http.get<Emote[]>(this.bttvGlobalUrl);

    return zip(channelEmotes, globalEmotes)
      .pipe(
        map(([channel, global]) =>
          channel.channelEmotes
            .concat(channel.sharedEmotes)
            .concat(global))
      );
  }

  public getFfzEmotes(): Observable<FfzEmoteShort[]> {
    return this.http.get<FfzEmoteResp>(this.ffzChannelUrl)
      .pipe(
        map(resp => resp.sets[resp.room.set].emoticons
          .map(em => emoteToShort(em)))
      );
  }

  public getBttvEmoteUrl(id: string): string {
    return `https://cdn.betterttv.net/emote/${id}/1x`;
  }

  public getTtvStandardEmoteUrl(id: string): string {
    return `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
  }

}
