import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
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

  public getTotalFilter(search: string, take: number, sort: ('dsc' | 'asc'), offset: number = 0): Observable<SearchResults> {
    const params = new HttpParams()
      .set('query', search)
      .set('take', take.toString())
      .set('offset', offset.toString())
      .set('sort', sort);

    return this.http.get<SearchResults>(this.baseUrl + 'search/videos', { params });
  }

  public getLatestVods(amount: number, offset: number = 0): Observable<VodMeta[]> {
    const params = new HttpParams()
      .set('data', 'true')
      .set('offset', offset.toString())
      .set('take', amount.toString());

    return this.http.get<VodMeta[]>(this.baseUrl + 'video/channel/ab4b0664-00c0-4624-b603-7ea1da2ff084', { params });
  }

  public getFilterByGame(gameId: string, sort: ('asc' | 'dsc'), take: number, offset: number = 0): Observable<VodMeta[]> {
    const params = new HttpParams()
      .set('take', take.toString())
      .set('offset', offset.toString())
      .set('sort', sort);

    return this.http.get<VodMeta[]>(this.baseUrl + 'search/videos/' + gameId, { params });
  }

}
