import {Component, Input} from '@angular/core';
import {Video, getYtThumbnail} from '../../models/filters';

@Component({
  selector: 'app-filter-video',
  templateUrl: './filter-video.component.html',
  styleUrls: ['./filter-video.component.scss']
})
export class FilterVideoComponent {
  @Input() video: Video;
  @Input() styling: string;

  public GetYtThumb(): string {
    return getYtThumbnail(this.video.ytId);
  }
}
