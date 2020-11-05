import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VodMetadata} from '../../../shared/models/video';
import {getYtThumbnail} from '../../../shared/models/filters';

@Component({
  selector: 'app-vod-container',
  templateUrl: './vod-container.component.html',
  styleUrls: ['./vod-container.component.scss']
})
export class VodContainerComponent implements OnInit {

  @Input() video: VodMetadata;

  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public GetYtThumb(): string {
    return getYtThumbnail(this.video.video.ytId);
  }

}