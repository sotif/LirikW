import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FilterResult, Video} from '../models/filters';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getTotalFilter(search: string): Observable<FilterResult> {
    const params = new HttpParams()
      .set('search', search);

    return this.http.get<FilterResult>(this.baseUrl + 'filter/', { params });
  }

  public getLatestVods(amount: number): Observable<Video[]> {
    const params = new HttpParams()
      .set('amount', amount.toString());

    return this.http.get<Video[]>(this.baseUrl + 'filter/latest', { params });
  }

  public getFilterByGame(gameId: string): Observable<Video[]> {
    const params = new HttpParams()
      .set('gameId', gameId);

    return this.http.get<Video[]>(this.baseUrl + 'filter/game', { params });
  }

}
