import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';
import { RestService } from 'src/app/data-management/rest.service';

@Component({
  selector: 'app-build-searcher',
  templateUrl: './build-searcher.page.html',
  styleUrls: ['./build-searcher.page.scss'],
})
export class BuildSearcherPage implements OnInit {
  public authToken: string;
  public $obs: Observable<any>;
  public nickname: any;

  constructor(private localService: LocalStorageService, private restService: RestService) { }

  async ngOnInit() {
    this.authToken = this.localService.getData('mssd2-auth-token');

    this.restService.getNicknameTest(this.authToken).subscribe((data) => {
      console.log(data)
      this.nickname = data['Response'].bungieNetUser.uniqueName;
    }, (error) => {
      console.log(error);
    })

    let response = await this.restService.getCurrentUser(this.authToken).toPromise();
    let membershipType = response['Response'].destinyMemberships[0].membershipType;
    let membershipId = response['Response'].destinyMemberships[0].membershipId;
    this.restService.getProfile(membershipType, membershipId).subscribe((data) => {
      console.log(data);
    })
  }
}
