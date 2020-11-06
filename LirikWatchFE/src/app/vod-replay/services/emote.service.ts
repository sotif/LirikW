import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, zip} from 'rxjs';
import {BttvEmoteResp, Emote} from '../models/bttvEmotes';
import {Emote as ttvEmote} from '../models/chat';
import {map} from 'rxjs/operators';
import {emoteToShort, FfzEmoteResp, FfzEmoteShort} from '../models/ffzEmotes';

@Injectable({
  providedIn: 'root'
})
export class EmoteService {

  private ttvGlobalUrl = 'https://badges.twitch.tv/v1/badges/global/display?language=en';
  private ttvChannelUrl = 'https://badges.twitch.tv/v1/badges/channels/23161357/display';

  private bttvGlobalUrl = 'https://api.betterttv.net/3/cached/emotes/global';
  private bttvChannelUrl = 'https://api.betterttv.net/3/cached/users/twitch/23161357';

  private ffzChannelUrl = 'https://api.frankerfacez.com/v1/room/id/23161357';
  private emoteMap: Map<string, string> = new Map<string, string>();

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

  }

  public formatCompleteMessage(msg: string, ttvEms: ttvEmote[]): string {
    // Adding all the ttv emotes to our global emote map before sending it further
    // That way we dont have to finess around the datastructure and can just brute force it
    if (ttvEms != null) {
      ttvEms.forEach(em => {
        const st = msg.substring(em.begin, em.end + 1);
        if (!this.emoteMap.has(st)) {
          // Add it to the global map
          this.emoteMap.set(st, this.getTtvStandardEmoteUrl(em.id));
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
