import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArmorDTO } from 'src/app/model/armorDTO';
import { ArmorType } from 'src/app/model/enums';
import { OpService } from 'src/app/services/op.service';
import { TEST } from 'src/assets/test';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  public results;
  public values;
  public exotic;
  public mods;
  public classMods;
  public classModsValues;
  public fragments;
  public stats;
  public armors;

  public iterates = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  public arTypes = ['HELMET', 'GAUNTLETS', 'CHEST', 'LEGS'];
  public container: string;

  constructor(private router: Router, private route: ActivatedRoute, private opService: OpService) { }

  ngOnInit() {
    this.results = this.route.snapshot.data['results'];
    //this.results = TEST;
    if (this.results === null || this.results === undefined) {
      this.router.navigate(['/build-searcher']);
    } else {
      this.mapper(this.results);
      console.log(this.results);
    }
  }

  public getSize() {
    if (this.exotic == null || this.exotic == undefined) {
      return 3;
    } else {
      return 4;
    }
  }

  public getTitles(index: number) {
    switch (index) {
      case 5:
        return 'Fragmentos'
      case 6:
        return 'Mods'
      case 7:
        return 'Mods de clase'
      case 8:
        return 'Total';
    }
  }

  private mapper(data: any) {
    this.exotic = data[0][1];
    this.mods = this.exotic === undefined ? [data[0][2], data[1][2], data[2][2], data[3][2]] : [data[0][2], data[1][2], data[2][2]];
    this.classMods = data[0][3];
    this.fragments = data[0][4];
    this.stats = data[0][6];
    this.values = this.exotic === undefined ? [data[0][0], data[1][0], data[2][0], data[3][0]] : [data[0][0], data[1][0], data[2][0]];

    let clss = data[0][5][0].classType;
    this.classModsValues = this.opService.getValueFromMods(this.classMods, clss, this.stats);

    this.armors = this.exotic === undefined ? [data[0][5], data[1][5], data[2][5], data[3][5]] : [data[0][5], data[1][5], data[2][5]];
    this.container = this.exotic === undefined ? "" : "container";
  }

  public getArmorById(temp: ArmorDTO[], index: number): ArmorDTO {
    let res;
    temp.forEach(a => {
      if (a.armorType == 'HELMET' && index == 0) {
        res = Object.create(a);
      } else if (a.armorType == 'GAUNTLETS' && index == 1) {
        res = Object.create(a);
      } else if (a.armorType == 'CHEST' && index == 2) {
        res = Object.create(a);
      } else if (a.armorType == 'LEGS' && index == 3) {
        res = Object.create(a);
      }
    })
    return res;
  }

  public getAcronym(name: string) {
    switch (name) {
      case 'MOVILIDAD':
        return 'MOV: ';
      case 'RESISTENCIA':
        return 'RES: ';
      case 'RECUPERACION':
        return 'REC: ';
      case 'DISCIPLINA':
        return 'DIS: ';
      case 'INTELECTO':
        return 'INT: ';
      case 'FUERZA':
        return 'FUE: ';
    }
  }

  public getTotalFromStat(i: number, j: number) {
    let sum = 10;
    let arms = this.armors[i];
    sum += this.classModsValues[j];
    sum += this.getModQuantity(i, this.stats[j]);
    sum += this.fragments[j];
    arms.forEach(a => {
      sum += this.getStatByName(a, this.stats[j]);
    })
    return sum;
  }

  public getModQuantity(index: number, stat: string) {
    let sum = 0;
    this.mods[index].forEach(m => {
      sum = m == stat ? sum + 10 : sum
    })
    return sum;
  }

  public getStatByName(armor: any, name: string) {
    let a: typeof armor;
    if (a == ArmorDTO) {
      return armor.getStatByName(name);
    } else {
      return this.getStat(armor, name);
    }
  }

  private getStat(armor: any, name: string) {
    switch (name) {
      case 'MOVILIDAD':
        return armor.mobility;
      case 'RESISTENCIA':
        return armor.resilience;
      case 'RECUPERACION':
        return armor.recovery;
      case 'DISCIPLINA':
        return armor.discipline;
      case 'INTELECTO':
        return armor.intellect;
      case 'FUERZA':
        return armor.strength;
    }
  }

  private getArmorType(type) {
    switch (type) {
      case 'HELMET':
        return ArmorType.HELMET;
      case 'GAUNTLETS':
        return ArmorType.GAUNTLETS;
      case 'CHEST':
        return ArmorType.CHEST;
      case 'LEGS':
        return ArmorType.LEGS;
    }
  }
}
