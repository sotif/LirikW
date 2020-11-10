import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {convertGameMetaToGame, GamesMeta, VodMetadata} from '../../../shared/models/video';
import {Game, getYtThumbnail} from '../../../shared/models/filters';
import {Router} from '@angular/router';

@Component({
  selector: 'app-vod-container',
  templateUrl: './vod-container.component.html',
  styleUrls: ['./vod-container.component.scss']
})
export class VodContainerComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
  ) {}

  @Input() video: VodMetadata;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('chapterView', {static: false}) chapterView: ElementRef;

  public chapterViewVisible = false;
  public dateString: string;
  public lengthString: string;

  private chapterViewNative: any;
  private readonly msInDay = 86400000;

  private static padZero(st: string): string {
    return `${(st.length === 1) ? '0' : ''}${st}`;
  }

  @HostListener('document:click', ['$event']) onClick(e: any): void {
    if (this.chapterViewVisible) {
      if (!this.chapterViewNative.contains(e.target)) {
        this.chapterViewVisible = false;
      }
    }
  }

  ngOnInit(): void {
    console.log(this.video);
    this.dateString = this.getDateString();
    this.lengthString = this.getLengthString();
  }

  ngAfterViewInit(): void {
    this.chapterViewNative = this.chapterView.nativeElement;
  }

  public GetYtThumb(): string {
    return getYtThumbnail(this.video.video.ytId);
  }

  public convertMetaToGame(meta: GamesMeta): Game {
    return convertGameMetaToGame(meta);
  }

  public toggleChapterView(): void {
    if (this.chapterViewVisible) {
      this.chapterViewVisible = false;
    } else {
      // This is such that the document click event listener can run and in the next tick
      // we will execute this statement. Otherwise they compete and might turn eachother off.
      setTimeout(() => {
        this.chapterViewVisible = true;
      });
    }
  }

  public jumpToVodAndGame(game: GamesMeta): void {
    this.router.navigate(['/vod', this.video.video.videoGuid], {
      queryParams: {
        skipTo: game.positionMilliseconds / 1000,
      }
    });
  }

  private getLengthString(): string {
    let length = this.video.video.lengthInSeconds;
    const hours = Math.floor(length / 3600);
    length -= hours * 3600;
    const mins = Math.floor(length / 60);
    const seconds = length - (mins * 60);
    return `${hours.toString()}:${VodContainerComponent.padZero(mins.toString())}:${VodContainerComponent.padZero(seconds.toString())}`;
  }

  private getDateString(): string {
    if (!this.video.video.createdAt) {
      return null;
    }
    const hoursDiff = this.getHoursDifference();
    if (hoursDiff < 24) {
      return `${Math.floor(hoursDiff).toString()} hours ago`;
    }
    const days = Math.floor(hoursDiff / 24);
    if (days < 30) {
      return `${days.toString()} days ago`;
    }
    const c = new Date(this.video.video.createdAt);
    return `${VodContainerComponent.padZero(c.getMonth().toString())}/${VodContainerComponent.padZero(c.getDate().toString())}/${c.getFullYear().toString()}`;
  }

  private getHoursDifference(): number {
    const today = new Date();
    const createdOn = new Date(this.video.video.createdAt);
    return Math.abs(today.getTime() - createdOn.getTime()) / 36e5;
  }

  private getDaysAgo(): number {
    const today = new Date();
    const createdOn = this.video.video.createdAt;

    today.setHours(0, 0, 0, 0);
    createdOn.setHours(0, 0, 0, 0);

    return (today.getTime() - createdOn.getTime()) / this.msInDay;
  }
}
