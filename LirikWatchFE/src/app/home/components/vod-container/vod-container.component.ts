import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {convertGameMetaToGame, GamesMeta, VodMetadata} from '../../../shared/models/video';
import {Game, getYtThumbnail} from '../../../shared/models/filters';

@Component({
  selector: 'app-vod-container',
  templateUrl: './vod-container.component.html',
  styleUrls: ['./vod-container.component.scss']
})
export class VodContainerComponent implements OnInit, AfterViewInit {

  @Input() video: VodMetadata;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('chapterView', {static: false}) chapterView: ElementRef;

  public chapterViewVisible = false;

  private chapterViewNative: any;

  @HostListener('document:click', ['$event']) onClick(e: any): void {
    if (this.chapterViewVisible) {
      if (!this.chapterViewNative.contains(e.target)) {
        this.chapterViewVisible = false;
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
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

  }
}
