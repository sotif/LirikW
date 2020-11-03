import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Comment} from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getChatBatch(vodId: number, startOffset: number, endOffset: number): Observable<Comment[]> {
    const params = new HttpParams()
      .set('startTime', startOffset.toString())
      .set('endTime', endOffset.toString());

    return this.http.get<Comment[]>(this.baseUrl + 'chat/' + vodId, { params });
  }

}
