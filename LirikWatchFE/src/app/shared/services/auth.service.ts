import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
    if (!environment.production) {
      this.baseUrl = 'https://dev.local.initial.network:5001/';
    }
  }

  public authenticate(code: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'api/auth', {code});
  }

  public loggedIn(): boolean {
    return false;
  }
}
/*{
    "name": "serenity_c7",
    "displayName": "Serenity_c7",
    "id": 45386791,
    "profilePictureUri": "https://static-cdn.jtvnw.net/jtv_user_pictures/serenity_c7-profile_image-021f5fbe2f1ed91f-300x300.png",
    "jwt": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJhdWQiOiJ5MmtnZXVwMG81aTE4Nzg0cTl1Zmo4enBuZzRlY2ciLCJleHAiOjE2MDQ3ODIzMDUsImlhdCI6MTYwNDc4MTQwNSwiaXNzIjoiaHR0cHM6Ly9pZC50d2l0Y2gudHYvb2F1dGgyIiwic3ViIjoiNDUzODY3OTEiLCJlbWFpbCI6Imdlcm1hbmdhbWVydjJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6IlNlcmVuaXR5X2M3In0.Tu6gnvG_L3bm3P5oCfI6HqociIC2yDeTL0fFCgY217RrB7tcUMP8xupy7WEhKjCymEgSP7K9O9pb4h9-mMpZm9L__gZwQtBZ_6ClMmB0gr64XOWYRFV9KEtyi2FQ0_C0vFWwn0cOL4ykg3I2SPSRBSd3Ck-Fh9clLH2DKlb2YXlhVBBQvY0Zx7PAwAPoxnDf7po2YxrmNAuDCrvHTl21mFg6xeZtRlpCpg2TjH-yyVlSl71mrQLnCXK8rqjytE1SPW6PMhLFBYx95Ja1NUa_r9c6_ZnEhNgfALEtEn2PfMGT4qvf3LjD6Wwzm6p9VnSavR5zCqgKrtR5RD0skRiLcg"
}*/
