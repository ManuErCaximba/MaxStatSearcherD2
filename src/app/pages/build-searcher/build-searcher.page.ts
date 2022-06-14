import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';
import { RestService } from 'src/app/data-management/rest.service';

import { ArmorDTO } from 'src/app/model/armorDTO';
import { ArmorType } from 'src/app/model/enums';

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

    let profile = await this.restService.getProfile(membershipType, membershipId).toPromise();
    let characterIds = profile['Response'].profile.data.characterIds;
    let items = [];
    for (let i = 0; i < 3; i++) {
      let temp = [];
      temp = [...temp, ...profile['Response'].characterEquipment.data[characterIds[i]].items];
      temp = [...temp, ...profile['Response'].characterInventories.data[characterIds[i]].items];
      items.push(temp);
    }

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

    let armorsIds = [];
    armors.forEach(charItems => {
      let temp = []
      charItems.map(a => {
        temp.push(a.itemInstanceId);
      })
      armorsIds.push(temp);
    })

    let defItems = [];
    this.restService.getItemManifestInfo().then(json => {
      armorsIds.forEach(async charItems => {
        let temp = []
        charItems.forEach(async id => {
          let item = await this.restService.getItem(membershipType, membershipId, id).toPromise();
          let itemHash = item['Response'].item.data.itemHash;
          let styleHash = item['Response'].item.data.overrideStyleItemHash;
          let iconUrl = styleHash !== undefined ? json[styleHash.toString()].displayProperties.icon : json[itemHash.toString()].displayProperties.icon;
          let name = json[itemHash].displayProperties.name;
          let itemSockets = item['Response'].sockets.data.sockets.slice(6, 10);
          let investmestStats = [];
          for (let i = 0; i < itemSockets.length; i++) {
            investmestStats.push(json[itemSockets[i].plugHash].investmentStats);
          }
          let baseStats = this.getStats(investmestStats);
          let armorType = this.getArmorType(item['Response'].item.data.bucketHash);
          let classType = json[itemHash.toString()].classType;
          temp.push(new ArmorDTO(
            id,
            itemHash,
            name,
            iconUrl,
            baseStats[0],
            baseStats[1],
            baseStats[2],
            baseStats[3],
            baseStats[4],
            baseStats[5],
            armorType,
            classType
          ));
        });
        defItems.push(temp)
      });
    });
  }

  private getStats(investmestStats: any[]) {
    var mobility: number = 0;
    var resilience: number = 0;
    var recovery: number = 0;
    var discipline: number = 0;
    var intellect: number = 0;
    var strength: number = 0;
    for (let i = 0; i < investmestStats.length; i++) {
      let iS = investmestStats[i];
      for (let j = 0; j < 3; j++) {
        switch (iS[j].statTypeHash) {
          case (2996146975):
            mobility += iS[j].value;
            break;
          case (392767087):
            resilience += iS[j].value;
            break;
          case (1943323491):
            recovery += iS[j].value;
            break;
          case (1735777505):
            discipline += iS[j].value;
            break;
          case (144602215):
            intellect += iS[j].value;
            break;
          case (4244567218):
            strength += iS[j].value;
            break;
        }
      }
    }
    return [mobility, resilience, recovery, discipline, intellect, strength];
  }

  private getArmorType(bucketHash: number) {
    switch (bucketHash) {
      case 3448274439:
        return ArmorType.HELMET;
      case 14239492:
        return ArmorType.CHEST;
      case 3551918588:
        return ArmorType.GAUNTLETS;
      case 20886954:
        return ArmorType.LEGS;
    }
  }
}
