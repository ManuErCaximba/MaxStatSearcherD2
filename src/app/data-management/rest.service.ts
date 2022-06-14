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

  private authToken = this.localService.getData('mssd2-auth-token') 

  constructor(
    private httpClient: HttpClient,
    private localService: LocalStorageService,
    private router: Router
  ) {}

  public async getItemManifestInfo() {
    let manifest = await this.getManifest().toPromise();
    let urlAdd: string = manifest['Response'].jsonWorldComponentContentPaths.en['DestinyInventoryItemDefinition'];
    return await fetch('https://www.bungie.net/' + urlAdd).then(res => {
      return res.json();
    })
  }

  private getManifest() {
    const headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    .set('X-API-key', environment.API_KEY);
    return this.httpClient
      .get(
        'https://www.bungie.net/Platform/Destiny2/manifest/',
        { headers: headers }
      )
  }

  public getItem(membershipType: string, membershipId: string, itemId: string) {
    const headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    .set('X-API-key', environment.API_KEY);
    return this.httpClient
      .get(
        'https://www.bungie.net/Platform/Destiny2/' + membershipType + '/Profile/' + membershipId + '/Item/' + itemId + '/?components=300,302,304,305,307',
        { headers: headers }
      )
  }

  public getProfile(membershipType: string, membershipId: string) {
    const headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    .set('X-API-key', environment.API_KEY);
    return this.httpClient
      .get(
        'https://www.bungie.net/Platform/Destiny2/' + membershipType + '/Profile/' + membershipId + '/?components=100,201,205',
        { headers: headers }
      )
  }

  public getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
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


  public getNicknameTest(): Observable<any> {
    const authHeader = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authToken)
      .set('X-API-key', environment.API_KEY);
    return this.httpClient
      .get(
        'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
        { headers: authHeader }
      )
  }
}
