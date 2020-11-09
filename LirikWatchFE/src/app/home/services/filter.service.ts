import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FilterResult} from '../../shared/models/filters';
import {VodMetadata} from '../../shared/models/video';
import {VodMeta} from '../../shared/models/vodFriends';
import {SearchResults} from '../../shared/models/searchFriends';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
    if (!environment.production) {
      this.baseUrl = environment.devApiUrl;
    }
  }

  public getTotalFilter(search: string, take: number, sort: ('dsc' | 'asc')): Observable<SearchResults> {
    const params = new HttpParams()
      .set('query', search)
      .set('take', take.toString())
      .set('sort', sort);

    return this.http.get<SearchResults>(this.baseUrl + 'search/videos', { params });
  }

  public getLatestVods(amount: number): Observable<VodMeta[]> {
    const params = new HttpParams()
      .set('data', 'true')
      .set('take', amount.toString());

    return this.http.get<VodMeta[]>(this.baseUrl + 'video/channel/ab4b0664-00c0-4624-b603-7ea1da2ff084', { params });
  }

  public getFilterByGame(gameId: string): Observable<VodMetadata[]> {
    const params = new HttpParams()
      .set('gameId', gameId);

    return this.http.get<VodMetadata[]>(this.baseUrl + 'filter/game', { params });
  }

}
