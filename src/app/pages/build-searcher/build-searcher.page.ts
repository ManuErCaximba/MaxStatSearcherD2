import { Component, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/data-management/data.service';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';
import { RestService } from 'src/app/data-management/rest.service';

import { ArmorDTO } from 'src/app/model/armorDTO';
import { ArmorType } from 'src/app/model/enums';
import { OpService } from 'src/app/services/op.service';
import { ResultPage } from '../result/result.page';

@Component({
  selector: 'app-build-searcher',
  templateUrl: './build-searcher.page.html',
  styleUrls: ['./build-searcher.page.scss'],
})
export class BuildSearcherPage implements OnInit {

  //Init vars
  public authToken: string;
  public armorsList = [];
  public userClasses: any = [];

  //Form vars
  public indexes: number[] = [0, 1, 2];
  public statsList: string[] = ['MOVILIDAD', 'RESISTENCIA', 'RECUPERACION', 'DISCIPLINA', 'INTELECTO', 'FUERZA'];
  public statsSelected: string[] = [null, null, null];
  public classList: string[] = ['TITAN', 'CAZADOR', 'HECHICERO'];

  public modList = [
    ['', 'MOVILIDAD', 'RESISTENCIA', 'RECUPERACION', 'DISCIPLINA', 'INTELECTO', 'FUERZA'],
    ['COSECHADORA DE CARGA', '-10', '-10', '-10', '', '', ''],
    ['CONVERSOR DE ENERGIA', '', '', '', '-10', '', ''],
    ['RESERVAS EXTRA', '', '', '', '', '-10', ''],
    ['AMISTADES PODEROSAS', '+20', '', '', '', '', ''],
    ['CARGA CON PRECISION', '', '', '', '-10', '', ''],
    ['CARGA DE PRECISION', '', '', '', '', '', '-10'],
    ['LUZ PROTECTORA', '', '', '', '', '', '-10'],
    ['LUZ RADIANTE', '', '', '', '', '', '+20'],
    ['CARGA Y RECARGA', '', '', '-10', '', '', ''],
    ['ATAQUE SORPRESA', '', '', '', '', '-10', ''],
  ]

  public statForm: FormGroup;

  constructor(
    private localService: LocalStorageService,
    private restService: RestService,
    private opService: OpService,
    private router: Router,
    private dataService: DataService) { }

  async ngOnInit() {
    this.statForm = new FormGroup({
      class: new FormControl(''),
      stat1: new FormControl(''),
      stat2: new FormControl(''),
      stat3: new FormControl(''),
      mods: new FormControl([]),
      fragment1: new FormControl(''),
      fragment2: new FormControl(''),
      fragment3: new FormControl(''),
      exotic: new FormControl('')
    })

    this.authToken = this.localService.getData('mssd2-auth-token');

    let currentUser = await this.restService.getCurrentUser().toPromise();
    let membershipType = currentUser['Response'].destinyMemberships[0].membershipType;
    let membershipId = currentUser['Response'].destinyMemberships[0].membershipId;

    let profile = await this.restService.getProfile(membershipType, membershipId).toPromise();
    console.log(profile);
    let characterIds = profile['Response'].profile.data.characterIds;
    let items = [];
    for (let i = 0; i < 3; i++) {
      let temp = [];
      temp = [...temp, ...profile['Response'].characterEquipment.data[characterIds[i]].items];
      temp = [...temp, ...profile['Response'].characterInventories.data[characterIds[i]].items];
      items = items.concat(temp);
    }
    items = items.concat(profile['Response'].profileInventory.data.items);
    console.log(items);

    let armors = [];
    items.forEach(i => {
      let isArmor = i.bucketHash == '14239492' || i.bucketHash == '3448274439' || i.bucketHash == '3551918588' || i.bucketHash == '20886954' || i.bucketHash == '138197802';
      if (isArmor) {
        armors.push(i);
      }
    })
    console.log(armors);

    let armorsIds = [];
    armors.forEach(i => {
      armorsIds.push(i.itemInstanceId);
    })

    console.log(armorsIds);
    this.restService.getItemManifestInfo().then(json => {
      armorsIds.forEach(async id => {
        let item = await this.restService.getItem(membershipType, membershipId, id).toPromise();
        let itemHash = item['Response'].item.data.itemHash;
        let inventory = json[itemHash.toString()].inventory;
        let bucketHash = inventory.bucketTypeHash;
        if (bucketHash == '14239492' || bucketHash == '3448274439' || bucketHash == '3551918588' || bucketHash == '20886954') {
          let isExotic = inventory.tierTypeName === 'Exotic' || inventory.tierTypeName === 'Excepcional' ? true : false;
          let classType = json[itemHash.toString()].classType;
          let itemSockets = item['Response'].sockets.data.sockets.slice(6, 10);
          let styleHash = item['Response'].item.data.overrideStyleItemHash;
          let iconUrl = styleHash !== undefined ? json[styleHash.toString()].displayProperties.icon : json[itemHash.toString()].displayProperties.icon;
          let name = json[itemHash].displayProperties.name;
          let investmestStats = [];
          for (let i = 0; i < itemSockets.length; i++) {
            let index = json[itemSockets[i].plugHash.toString()].investmentStats;
            investmestStats.push(index);
          }
          let baseStats = this.getStats(investmestStats);
          let armorType = this.getArmorType(inventory.bucketTypeHash);
          this.armorsList.push(new ArmorDTO(
            id,
            itemHash,
            name,
            'https://www.bungie.net' + iconUrl,
            baseStats[0],
            baseStats[1],
            baseStats[2],
            baseStats[3],
            baseStats[4],
            baseStats[5],
            armorType,
            classType,
            isExotic
          ));
        }
      })
    });
    console.log(this.armorsList);
  }

  public setValue(mod) {
    let modL = [];
    let values = this.statForm.get('mods').value;
    if (values.indexOf(mod) < 0) {
      modL = [...modL, ...values];
      modL = [...modL, mod];
      this.statForm.controls.mods.setValue(modL);
    } else {
      modL = values;
      modL.splice(modL.indexOf(mod), 1);
      this.statForm.controls.mods.setValue(modL);
    }
  }

  public onSubmit() {
    this.dataService.setData(1, this.opService.calc(this.statForm, this.armorsList));
    this.router.navigate(['/result']);
  }

  public getExoticsFromClass() {
    let res = [];
    for (let i = 0; i < this.armorsList.length; i++) {
      if (this.armorsList[i].isExotic && this.classList.indexOf(this.getClassValue()) == this.armorsList[i].classType) {
        res.push(this.armorsList[i]);
      }
    }
    res.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
    return res;
  }

  public addValue($event, index) {
    this.statsSelected[index] = $event.detail.value;
  }

  public checkCosCharg(index: number) {
    let c = this.getClassValue();
    return (c == 'CAZADOR' && index == 0) || (c == 'TITAN' && index == 1) || (c == 'HECHICERO' && index == 2)
  }

  public getClassValue() {
    return this.statForm.get('class').value;
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
