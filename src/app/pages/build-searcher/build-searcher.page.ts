import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';
import { RestService } from 'src/app/data-management/rest.service';

import { ArmorDTO } from 'src/app/model/armorDTO';

@Component({
  selector: 'app-build-searcher',
  templateUrl: './build-searcher.page.html',
  styleUrls: ['./build-searcher.page.scss'],
})
export class BuildSearcherPage implements OnInit {
  public authToken: string;

  constructor(private localService: LocalStorageService, private restService: RestService) { }

  async ngOnInit() {
    this.authToken = this.localService.getData('mssd2-auth-token');

    let currentUser = await this.restService.getCurrentUser().toPromise();
    let membershipType = currentUser['Response'].destinyMemberships[0].membershipType;
    let membershipId = currentUser['Response'].destinyMemberships[0].membershipId;

    this.restService.getProfile(membershipType, membershipId).subscribe((data) => {
      console.log(data);
    })

    let profile = await this.restService.getProfile(membershipType, membershipId).toPromise();
    let characterIds = profile['Response'].profile.data['characterIds'];
    let items = [];
    for (let i = 0; i < 3; i++) {
      let temp = [];
      temp = [...temp, ...profile['Response'].characterEquipment.data[characterIds[i]].items];
      temp = [...temp, ...profile['Response'].characterInventories.data[characterIds[i]].items];
      items.push(temp);
    }
    console.log(items);

    let armors = [];
    items.forEach(charItems => {
      let temp = []
      charItems.map(i => {
        let isArmor = i.bucketHash == '14239492' || i.bucketHash == '3448274439' || i.bucketHash == '3551918588' || i.bucketHash == '20886954';
        if (isArmor) {
          temp.push(i);
        }
      });
      armors.push(temp);
    })

    console.log(armors);

    let armorsIds = [];
    armors.forEach(charItems => {
      let temp = []
      charItems.map(a => {
        temp.push(a.itemInstanceId);
      })
      armorsIds.push(temp);
    })

    console.log(armorsIds);


    // Extrayendo los perks de los items se puede ver si tiene mods como powerful friends que afecten a los stats
    let defItems = [];
    this.restService.getItemManifestInfo().then(json => {
      armorsIds.forEach(async charItems => {
        let temp = []
        charItems.forEach(async id => {
          let item = await this.restService.getItem(membershipType, membershipId, id).toPromise();
          let itemData = item['Response'].item.data;
          let nameIcon = itemData.overrideStyleItemHash === undefined ? json[itemData.itemHash].displayProperties :
            [json[itemData.itemHash].displayProperties, json[itemData.overrideStyleItemHash].displayProperties];
          let itemNameIcon = [item].concat(nameIcon);
          temp.push(itemNameIcon);
          //temp.push(new ArmorDTO(itemNameIcon));
        });
        defItems.push(temp)
      });
    });
    console.log(defItems);


  }
  //14239492 chest hash
  //3448274439 helmet hash
  //3551918588 gauntlets hash
  //20886954 leg hash
}
