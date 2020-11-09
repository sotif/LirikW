import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VodMetadata, YtId} from '../../shared/models/video';
import {VodMeta} from '../../shared/models/vodFriends';

@Injectable({
  providedIn: 'root'
})
export class VodService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
    if (!environment.production) {
      this.baseUrl = environment.devApiUrl;
    }
  }

  public getVodData(vodId: string): Observable<VodMeta> {
    return this.http.get<VodMeta>(this.baseUrl + 'video/' + vodId);
  }

  public getYtId(vodId: number): Observable<YtId> {
    return this.http.get<YtId>(this.baseUrl + 'video/' + vodId.toString() + '/ytid');
  }
}
