import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ChatService} from './services/chat.service';
import {Comment} from './models/chat';
import {VodService} from './services/vod.service';
import {convertGameMetaToGame} from '../shared/models/video';
import {Game} from '../shared/models/filters';
import {EmoteService} from './services/emote.service';
import RelatedVideos = YT.RelatedVideos;
import ModestBranding = YT.ModestBranding;
import AutoPlay = YT.AutoPlay;
import {GameMeta, vGameToInternal, VodMeta} from '../shared/models/vodFriends';
import {ChatReply} from './models/friendsChat';

@Component({
  selector: 'app-vod-replay',
  templateUrl: './vod-replay.component.html',
  styleUrls: ['./vod-replay.component.scss']
})
export class VodReplayComponent implements OnInit, OnDestroy, AfterViewInit {
  // thumbnail https://img.youtube.com/vi/ov3U7JWu_2Y/maxresdefault.jpg
  public ytVideoId: string;
  public vodMetadata: VodMeta;

  public playerVars: YT.PlayerVars = {
    rel: RelatedVideos.Hide,
    modestbranding: ModestBranding.Modest,
    autoplay: AutoPlay.AutoPlay,
  };

  public viewChapterSelect = false;
  @ViewChild('chapterSelect', {static: false}) chapterSelectView: ElementRef;

  @ViewChild('player') player: any;

  @ViewChild('messageList', {static: false}) messageList: ElementRef;
  @ViewChildren('messages') messages: QueryList<any>;

  public viewChat: ChatReply[] = [];

  private vodId: string;
  private playerReady = false;
  private lastCheckTime = 0;
  private lastTime = 0;
  private lastEndTime = 0;

  private readonly FETCH_INTERVAL = 7;
  private readonly CHAT_OFFSET_SIZE = 10;
  private readonly MAX_CHAT_SIZE = 120;

  private destroy$  = new Subject();
  private recChat: ChatReply[] = [];
  private scrollMessageList: any;
  private chapterSelectNative: any;

  private skipTo: number = undefined;
  private ytPlayer: YT.Player;

  @HostListener('document:click', ['$event']) onClick(e: any): void {
    if (this.viewChapterSelect) {
      if (!this.chapterSelectNative.contains(e.target)) {
        this.viewChapterSelect = false;
      }
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private vodService: VodService,
    private emoteService: EmoteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.vodId = params.id;
        if (!this.vodId) {
          this.router.navigate(['/']);
          return;
        }

        // Get vod data
        this.vodService.getVodData(this.vodId)
          .subscribe((data) => {
            this.ytVideoId = data.youTubeId;
            data.games = data.games.map(g => {
              if (!g.positionMilliseconds) {
                g.positionMilliseconds = 0;
              }
              return g;
            }).sort((a, b) => {
              return a.positionMilliseconds < b.positionMilliseconds ? -1 : 1;
            });

            this.vodMetadata = data;

            this.viewChat.push(this.createSystemMessage('Loading Chat. Hang tight :)'));

            this.skipTo = this.activatedRoute.snapshot.queryParams.skipTo;


            // start fetch timer
            interval(500)
              .pipe(takeUntil(this.destroy$))
              .subscribe(x => {
                this.fetchChat();
              });

            // Update Chat
            interval(500)
              .pipe(takeUntil(this.destroy$))
              .subscribe(x => {
                this.updateChat();
              });

          }, err => {
            // TODO PROPER ERRORS
            console.error(err);
            this.viewChat.push(this.createSystemMessage('Failed to fetch Vod or Youtube video!'));
          });
      });
  }

  ngAfterViewInit(): void {
    this.scrollMessageList = this.messageList.nativeElement;
    this.messages.changes.subscribe(_ => this.onMessageListChanged());
    this.chapterSelectNative = this.chapterSelectView.nativeElement;
  }

  public onReady(e: YT.PlayerEvent): void {
    this.playerReady = true;
    this.ytPlayer = e.target;
    if (this.skipTo) {
      e.target.seekTo(this.skipTo, true);
    }
    this.player.playVideo();
  }

  public onStateChange(e: YT.OnStateChangeEvent): void {
    if (e.data === 0) {
      this.player.playVideo();
    }
  }

  public convertMetaToGame(meta: GameMeta): Game {
    return convertGameMetaToGame(vGameToInternal(meta));
  }

  public toggleChapterView(): void {
    if (this.viewChapterSelect) {
      this.viewChapterSelect = false;
    } else {
      // This is such that the document click event listener can run and in the next tick
      // we will execute this statement. Otherwise they compete and might turn eachother off.
      setTimeout(() => {
        this.viewChapterSelect = true;
      });
    }
  }

  public jumpToChapter(game: GameMeta): void {
    this.player._player.seekTo(game.positionMilliseconds / 1000, true);
    this.viewChapterSelect = false;
  }

  private clearChat(): void {
    this.viewChat = [];
    this.recChat = [];
    this.viewChat.push(this.createSystemMessage('Loading Chat. Hang tight :)'));
  }

  private createSystemMessage(message: string): ChatReply {
    return {
      commenter: {
        displayName: 'System'
      },
      body: message,
      data: {
        userColor: '#808080',
      },
      offset: 0,
      badges: [],
      emotes: [],
    };
  }

  private fetchChat(): void {
    if (!this.playerReady) {
      return;
    }
    // Periodically get chat for yt timestamp
    const time = parseInt(this.player._player.getCurrentTime().toFixed(3), 10);

    // CHECK IF PAUSED
    if (this.player._player.getPlayerState() === 2) {
      return;
    }

    // CHECK IF WE SKIPPED!
    let cleared = false;
    if (Math.abs(time - this.lastTime) > 2) {
      this.clearChat();
      this.lastEndTime = 0;
      this.lastCheckTime = time;
      cleared = true;
    }

    this.lastTime = time;

    if (time <= (this.lastCheckTime + this.FETCH_INTERVAL) && !cleared) {
      return; // Paused or not enough time passed
    }

    this.lastCheckTime = this.lastEndTime;
    if (this.lastEndTime === 0) {
      this.lastCheckTime = time;
    }

    this.lastEndTime = this.lastCheckTime + this.CHAT_OFFSET_SIZE;

    // Make call to backend
    this.chatService.getChatBatch(this.vodId, this.lastCheckTime, this.lastEndTime)
      .subscribe((chat) => {
        this.recChat = this.recChat.concat(chat);
      }, err => {
        console.error(err);
      });
  }

  private updateChat(): void {
    while (this.recChat.length !== 0) {
      const top = this.recChat[0];
      if (top.offset > this.player._player.getCurrentTime()) {
        return;
      }

      // Else we pop and keep going
      this.recChat.shift();

      // Before pushing edit the emotes into the message
      top.body = this.emoteService.formatCompleteMessage(top.body, top.emotes);
      top.badgeUrls = this.emoteService.getBadgeUrls(top.badges);
      this.viewChat.push(top);

      // Check viewChat size to reduce ram usage and lag
      if (this.viewChat.length >= this.MAX_CHAT_SIZE) {
        this.viewChat = this.viewChat.slice((this.MAX_CHAT_SIZE / 2), this.viewChat.length);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private onMessageListChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollMessageList.scroll({
      top: this.scrollMessageList.scrollHeight,
      left: 0,
      behavior: 'auto'
    });
  }

}
