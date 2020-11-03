import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, interval} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ChatService} from './services/chat.service';
import {Comment} from './models/chat';
import {YtService} from './services/yt.service';

@Component({
  selector: 'app-vod-replay',
  templateUrl: './vod-replay.component.html',
  styleUrls: ['./vod-replay.component.scss']
})
export class VodReplayComponent implements OnInit, OnDestroy, AfterViewInit {
  // thumbnail https://img.youtube.com/vi/ov3U7JWu_2Y/maxresdefault.jpg
  public ytVideoId;
  @ViewChild('player') player: any;

  @ViewChild('messageList', {static: false}) messageList: ElementRef;
  @ViewChildren('messages') messages: QueryList<any>;

  public viewChat: Comment[] = [];

  private vodId: number;
  private playerReady = false;
  private lastCheckTime = 0;
  private lastTime = 0;

  private readonly FETCH_INTERVAL = 7;
  private readonly CHAT_OFFSET_SIZE = 10;
  private readonly MAX_CHAT_SIZE = 120;

  private destroy$  = new Subject();
  private recChat: Comment[] = [];
  private scrollMessageList: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private ytService: YtService,
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
          // TODO Change not found page!!!!
          alert('Not found, CHANGE THIS');
          return;
        }

        // Get yt vod id
        this.ytService.getYtId(this.vodId)
          .subscribe((id) => {
            this.ytVideoId = id.id;

            this.viewChat.push(this.createSystemMessage('Loading Chat. Hang tight :)'));

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

  public onReady(e: YT.PlayerEvent): void {
    this.playerReady = true;
    this.player.playVideo();
  }

  public onStateChange(e: YT.OnStateChangeEvent): void {
    if (e.data === 0) {
      this.player.playVideo();
    }
  }

  private clearChat(): void {
    this.viewChat = [];
    this.recChat = [];
    this.viewChat.push(this.createSystemMessage('Loading Chat. Hang tight :)'));
  }

  private createSystemMessage(message: string): Comment {
    return {
      commenter: {
        displayName: 'System'
      },
      id: '0',
      messageContent: {
        userColor: '#808080',
        body: message,
        emotes: null
      },
      contentOffsetSeconds: 0,
      createdAt: ''
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
      cleared = true;
    }

    this.lastTime = time;

    if (time <= (this.lastCheckTime + this.FETCH_INTERVAL) && !cleared) {
      return; // Paused or not enough time passed
    }

    this.lastCheckTime = time;

    // Make call to backend
    this.chatService.getChatBatch(this.vodId, this.lastCheckTime, this.lastCheckTime + this.CHAT_OFFSET_SIZE)
      .subscribe((chat) => {
        this.recChat = this.recChat.concat(chat);
      }, err => {
        this.viewChat.push(this.createSystemMessage('Failed to fetch chat :( Sorry'));
        console.error(err);
      });
  }

  private updateChat(): void {
    while (true) {
      if (this.recChat.length === 0) {
        return;
      }

      const top = this.recChat[0];
      if (top.contentOffsetSeconds > this.player._player.getCurrentTime()) {
        return;
      }

      // Else we pop and keep going
      this.recChat.shift();
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

  ngAfterViewInit(): void {
    this.scrollMessageList = this.messageList.nativeElement;
    this.messages.changes.subscribe(_ => this.onMessageListChanged());
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
