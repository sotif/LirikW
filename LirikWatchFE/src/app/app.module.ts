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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VodReplayComponent,
    VodNavComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    TabViewModule,
    YouTubePlayerModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
