import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FilterResult} from '../models/filters';

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

}
