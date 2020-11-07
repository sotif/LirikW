import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthResponse, authToTwitchUser, TwitchUser} from '../models/auth';
import {catchError, map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;
  private twitchUser: TwitchUser;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient
  ) {
    if (!environment.production) {
      this.baseUrl = 'https://dev.local.initial.network:5001/';
    }
  }

  public authenticate(code: string): Observable<TwitchUser> {
    return this.http.post<AuthResponse>(this.baseUrl + 'api/auth', {code})
      .pipe(
        map((resp: AuthResponse) => {
          localStorage.setItem('token', resp.jwt);
          this.twitchUser = authToTwitchUser(resp);
          return this.twitchUser;
        })
      );
  }

  public getUser(): TwitchUser {
    return this.twitchUser;
  }

  public logout(): void {
    localStorage.removeItem('token');
  }

  public loggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    return !this.jwtHelper.isTokenExpired(token);
  }
}
