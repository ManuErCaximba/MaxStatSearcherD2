import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  request: Observable<any>;

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {}

  public login() {
    this.request = this.httpClient.get('https://www.bungie.net/en/oauth/authorize?client_id=40559&response_type=code', {
      headers: {
        'access-control-allow-origin': '*'
      }
    });

    this.request.subscribe(data => {
      console.log(data);
    });
  }
}
