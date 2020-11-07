import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private isProd = environment.production;

  constructor() {
  }

  ngOnInit(): void {
  }

  public onLoginClick(): void {
    if (this.isProd) {
      window.location.href = 'https://id.twitch.tv/oauth2/authorize?client_id=mo6oz9qrra8l5bpy4m7ttbfs8s5trv&redirect_uri=https://lirik.tv/login/auth&response_type=code&scope=user:read:email+openid&claims={%22id_token%22:{%22email%22:null,%22email_verified%22:null,%22preferred_username%22:null},%22userinfo%22:{%22picture%22:null}}';
    } else {
      window.location.href = 'https://id.twitch.tv/oauth2/authorize?client_id=y2kgeup0o5i18784q9ufj8zpng4ecg&redirect_uri=http://localhost:4200/login/auth&response_type=code&scope=user:read:email+openid&claims={%22id_token%22:{%22email%22:null,%22email_verified%22:null,%22preferred_username%22:null},%22userinfo%22:{%22picture%22:null}}';
    }
  }
}
