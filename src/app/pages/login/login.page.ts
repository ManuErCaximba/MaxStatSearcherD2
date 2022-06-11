import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';
import { RestService } from 'src/app/data-management/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public href: string =
    'https://www.bungie.net/en/OAuth/Authorize?client_id=40559&response_type=code';
  public code: any = undefined;
  public bungieName: string = null;
  public local: any = null;

  public showLogin: boolean = false;

  constructor(
    private response: ActivatedRoute,
    private router: Router,
    private localService: LocalStorageService,
    private restService: RestService
  ) {}

  public ngOnInit() {
    let clientToken = this.localService.getData('mssd2-auth-token');
    if (clientToken !== null && clientToken !== undefined) {
      this.router.navigate(['/build-searcher']);
    } else {
      let authCode = this.response.snapshot.queryParams['code'];
      this.localService.saveData('mssd2-auth-code', authCode);
      if (authCode !== null && authCode !== undefined) {
        this.restService.getAuthToken(authCode);
      } else {
        this.showLogin = true;
      }
    }
  }
}
