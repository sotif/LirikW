import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {YtId} from '../models/video';

@Injectable({
  providedIn: 'root'
})
export class YtService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getYtId(vodId: number): Observable<YtId> {
    return this.http.get<YtId>(this.baseUrl + 'video/' + vodId.toString());
  }
}
