import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VodMetadata, YtId} from '../../shared/models/video';

@Injectable({
  providedIn: 'root'
})
export class VodService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getVodData(vodId: number): Observable<VodMetadata> {
    return this.http.get<VodMetadata>(this.baseUrl + 'video/' + vodId.toString());
  }

  public getYtId(vodId: number): Observable<YtId> {
    return this.http.get<YtId>(this.baseUrl + 'video/' + vodId.toString() + '/ytid');
  }
}
