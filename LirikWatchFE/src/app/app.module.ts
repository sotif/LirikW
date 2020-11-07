import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './routes';
import {TabViewModule} from 'primeng/tabview';
import { VodReplayComponent } from './vod-replay/vod-replay.component';
import { VodNavComponent } from './vod-replay/components/vod-nav/vod-nav.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { LoadSpinnerComponent } from './shared/components/load-spinner/load-spinner.component';
import { FilterVideoComponent } from './home/components/filter-video/filter-video.component';
import { FilterGameComponent } from './home/components/filter-game/filter-game.component';
import { VodContainerComponent } from './home/components/vod-container/vod-container.component';
import { FooterComponent } from './home/components/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './login/components/auth/auth.component';
import {JwtModule} from '@auth0/angular-jwt';

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VodReplayComponent,
    VodNavComponent,
    LoadSpinnerComponent,
    FilterVideoComponent,
    FilterGameComponent,
    VodContainerComponent,
    FooterComponent,
    LoginComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    TabViewModule,
    YouTubePlayerModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: [ '*/api' ],
        disallowedRoutes: [ '*/api/auth' ]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
