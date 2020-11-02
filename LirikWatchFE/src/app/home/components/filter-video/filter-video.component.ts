import {Component, Input, OnInit} from '@angular/core';
import {Video} from '../../models/filters';

@Component({
  selector: 'app-filter-video',
  templateUrl: './filter-video.component.html',
  styleUrls: ['./filter-video.component.scss']
})
export class FilterVideoComponent {
  @Input() video: Video;
}
