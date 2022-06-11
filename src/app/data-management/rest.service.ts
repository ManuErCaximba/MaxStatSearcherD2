import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(
    private httpClient: HttpClient,
    private localService: LocalStorageService,
    private router: Router
  ) {}

  public getProfile(membershipType: string, membershipId: string) {
    const headers = new HttpHeaders()
    .set('X-API-key', environment.API_KEY);
    return this.httpClient
      .get(
        'https://www.bungie.net/Platform/Destiny2/' + membershipType + '/Profile/' + membershipId + '/?components=100',
        { headers: headers }
      )
  }

  public getCurrentUser(authToken: string): Observable<any> {
    const headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + authToken)
    .set('X-API-key', environment.API_KEY);
    return this.httpClient
      .get(
        'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
        { headers: headers }
      )
  }

  public getAuthToken(authCode: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    const body = new HttpParams()
      .set('client_id', environment.CLIENT_ID)
      .set('grant_type', 'authorization_code')
      .set('code', authCode);
    this.httpClient
      .post('https://www.bungie.net/platform/app/oauth/token/', body, {
        headers,
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.localService.saveData('mssd2-auth-token', data['access_token']);
          this.router.navigate(['/build-searcher']);
        },
        (error) => {
          console.log(error);
        }
      );
  }


  public getNicknameTest(authToken: string): Observable<any> {
    const authHeader = new HttpHeaders()
      .set('Authorization', 'Bearer ' + authToken)
      .set('X-API-key', environment.API_KEY);
    return this.httpClient
      .get(
        'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
        { headers: authHeader }
      )
  }
}
