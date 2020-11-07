import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {VodReplayComponent} from './vod-replay/vod-replay.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {LoginComponent} from './login/login.component';


export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'vod/:id',
        component: VodReplayComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
