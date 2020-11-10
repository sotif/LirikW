import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthResponse, authToTwitchUser, TwitchUser} from '../models/auth';
import {map} from 'rxjs/operators';
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
  ) {}

  public authenticate(code: string): Observable<TwitchUser> {
    return this.http.post<AuthResponse>(this.baseUrl + 'auth', {code})
      .pipe(
        map((resp: AuthResponse) => {
          localStorage.setItem('api-token', resp.jwt);
          this.twitchUser = authToTwitchUser(resp);
          return this.twitchUser;
        })
      );
  }

  public getUser(): TwitchUser {
    return this.twitchUser;
  }

  public logout(): void {
    localStorage.removeItem('api-token');
  }

  public loggedIn(): boolean {
    const token = localStorage.getItem('api-token');
    if (!token) {
      return false;
    }

    const expired = this.jwtHelper.isTokenExpired(token);
    if (!expired) {
      return true;
    }

    localStorage.removeItem('api-token');
    return false;
  }
}
