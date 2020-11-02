import {Component, Input, OnInit} from '@angular/core';
import {Game} from '../../models/filters';

@Component({
  selector: 'app-filter-game',
  templateUrl: './filter-game.component.html',
  styleUrls: ['./filter-game.component.scss']
})
export class FilterGameComponent {

  @Input() game: Game;
}
