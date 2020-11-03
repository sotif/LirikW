import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {VodReplayComponent} from './vod-replay/vod-replay.component';


export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'vod/:id',
    component: VodReplayComponent
  }
];
