import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {VodReplayComponent} from './vod-replay/vod-replay.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from './login/components/auth/auth.component';
import {NotAuthGuard} from './shared/guards/not-auth.guard';


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
    canActivate: [NotAuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'auth',
        component: AuthComponent
      }
    ]
  }
];
