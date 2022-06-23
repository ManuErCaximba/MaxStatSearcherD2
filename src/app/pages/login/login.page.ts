import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';
import { RestService } from 'src/app/data-management/rest.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public href: string =
    'https://www.bungie.net/en/OAuth/Authorize?client_id=' + environment.CLIENT_ID + '&response_type=code';
  public code: any;
  public bungieName: string;
  public local: any;

  public showLogin: boolean = false;

  constructor(
    private response: ActivatedRoute,
    private router: Router,
    private localService: LocalStorageService,
    private restService: RestService
  ) { }

  public ngOnInit() {
    let authCode = this.response.snapshot.queryParams['code'];
    if (authCode === undefined || authCode === null) {
      authCode = this.localService.getData('mssd2-auth-code');
    }
    this.restService.getAuthToken(authCode).subscribe(
      (data) => {
        console.log(data);
        this.localService.saveData('mssd2-auth-code', authCode);
        this.localService.saveData('mssd2-auth-token', data['access_token']);
        this.localService.saveData('mssd2-refresh-token', data['refresh_token']);
        this.router.navigate(['build-searcher']);
      },
      (error) => {
        console.log(error);
        this.showLogin = true;
      }
    );
  }
}
