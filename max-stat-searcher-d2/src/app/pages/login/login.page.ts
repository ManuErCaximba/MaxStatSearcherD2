import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public href: string =
        'https://www.bungie.net/en/OAuth/Authorize?client_id=40559&response_type=code';
    public code: string = null;
    public bungieName: string = null;
    public local: any = null;

    constructor(
        private navCtrl: NavController,
        private httpClient: HttpClient,
        private router: ActivatedRoute
    ) {
        this.local = new Storage();
    }

    public ngOnInit() {}

    public createAuthToken() {
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );
        const body = new HttpParams()
            .set('client_id', '40559')
            .set('grant_type', 'authorization_code')
            .set('code', this.code);
        this.httpClient
            .post('https://www.bungie.net/platform/app/oauth/token/', body, {
                headers,
            })
            .subscribe(
                (data) => {
                    console.log(data);
                    const authHeader = new HttpHeaders()
                        .set('Authorization', 'Bearer ' + data['access_token'])
                        .set('X-API-key', '17c125d33fc94ebabba5337d489e5dd0');
                    this.httpClient
                        .get(
                            'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
                            { headers: authHeader }
                        )
                        .subscribe((resp) => {
                            console.log(
                                resp['Response'].bungieNetUser.uniqueName
                            );
                            this.bungieName =
                                resp['Response'].bungieNetUser.uniqueName;
                        });
                },
                (error) => {
                    console.log(error);
                }
            );
    }
}
