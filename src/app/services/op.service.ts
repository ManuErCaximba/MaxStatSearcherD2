import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ArmorDTO } from '../model/armorDTO';

@Injectable({
  providedIn: 'root'
})
export class OpService {

  constructor() { }

  public calc(statForm: FormGroup, armorsList: ArmorDTO[]) {
    // Form values
    let clss = statForm.get('class').value;
    let stat1 = statForm.get('stat1').value;
    let stat2 = statForm.get('stat2').value;
    let stat3 = statForm.get('stat3').value;
    let mods = statForm.get('mods').value;
    let aspect1 = statForm.get('aspect1').value;
    let aspect2 = statForm.get('aspect2').value;
    let aspect3 = statForm.get('aspect3').value;
    let exotic = statForm.get('exotic').value;

    // Setting result values
    let defStat1 = 10 + aspect1;
    let defStat2 = 10 + aspect2;
    let defStat3 = 10 + aspect3;
    if (exotic !== null && exotic !== undefined) {
      defStat1 += exotic.getStatByName(stat1);
      defStat2 += exotic.getStatByName(stat2);
      defStat3 += exotic.getStatByName(stat3);
    }
    if (mods.length != 0) {
      let modsValues = this.getValueFromMods(mods, clss, [stat1, stat2, stat3]);
      defStat1 += modsValues[0];
      defStat2 += modsValues[1];
      defStat3 += modsValues[2];
    }
    let purArmor = this.getLegendaryArmor(armorsList, exotic);
    let armorsTypes = [exotic.armorType];
    // Algorithm
    let one = [];
    let oneMaxC = 0;
    let two = [];
    let twoMaxC = 0;
    let three = [];
    let threeMaxC = 0;
    let four = [];
    let fourMaxC = 0;
    let checkSum = [];

    for (let i = 0; i < purArmor.length; i++) {
      let a = purArmor[i];
      let x = a.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3]) / 2;
      if (x > oneMaxC) {
        oneMaxC = x;
        one = [a]
      }
    }
    
    armorsTypes.push(one[0].armorType);
    let purArmor2 = [];
    purArmor.forEach(e => {
      if (armorsTypes.indexOf(e.armorType) < 0) {
        purArmor2.push(e);
      }
    })
    for (let i = 0; i < purArmor2.length; i++) {
      let b = purArmor2[i]
      let xy = ((2*oneMaxC) + b.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3])) / 3;
      if (xy > twoMaxC) {
        twoMaxC = xy;
        two = [one[0], b];
      }
    }

    armorsTypes.push(two[1].armorType);
    let purArmor3 = [];
    purArmor2.forEach(e => {
      if (armorsTypes.indexOf(e.armorType) < 0) {
        purArmor3.push(e);
      }
    })
    for (let i = 0; i < purArmor3.length; i++) {
      let c = purArmor3[i]
      let xyz = ((3*twoMaxC) + c.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3])) / 4;
      if (xyz > twoMaxC) {
        threeMaxC = xyz;
        three = [two[0], two[1], c];
      }
    }

    if (exotic === null || exotic === undefined) {
      armorsTypes.push(three[2].armorType);
      let purArmor4 = [];
      purArmor3.forEach(e => {
        if (armorsTypes.indexOf(e.armorType) < 0) {
          purArmor4.push(e);
        }
      })
      for (let i = 0; i < purArmor4.length; i++) {
        let d = purArmor4[i]
        let xyzt = ((4*threeMaxC) + d.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3])) / 4;
        if (xyzt > threeMaxC) {
          threeMaxC = xyzt;
          three = [three[0], three[1], three[2], d];
        }
      }
    }

    let results = []
    let combList = [one, two, three, four];

    combList.forEach(comb => {
      let sum = [defStat1, defStat2, defStat3];
      comb.forEach(a => {
        sum[0] += a.getStatByName(stat1);
        sum[1] += a.getStatByName(stat2);
        sum[2] += a.getStatByName(stat3);
      })
      let mods =  this.getMods(sum, [stat1, stat2, stat3]);
      results.push([sum, mods, comb, [stat1, stat2, stat3]])
    })   
    return results;
  }

  private getMods(values: number[], stats: string[]) {
    let mods = []
    for (let i = 0; i < 5; i++) {
      let value = Math.min.apply(null, values);
      let index = values.indexOf(value);
      mods.push(stats[index]);
      values[index] += 10
    }
    return mods;
  }

  private getLegendaryArmor(armorsList, exotic) {
    let res = [];
    armorsList.forEach(a => {
      if ((exotic === null || (exotic !== null && a.classType !== exotic.classType)) && !a.isExotic) {
        res.push(a);
      }
    })
    return res;
  }

  private getValueFromMods(mods, clss, stats) {
    let result = [0,0,0];
    mods.forEach(mod => {
      switch (mod) {
        case 'COSECHADORA DE CARGA':
          switch (clss) {
            case 'TITAN':
              result[stats.indexOf('RESISTENCIA')] -= 10;
            case 'CAZADOR':
              result[stats.indexOf('MOVILIDAD')] -= 10;
            case 'HECHICERO':
              result[stats.indexOf('RECUPERACION')] -= 10;
          }
        case 'CONVERSOR DE ENERGIA':
          result[stats.indexOf('DISCIPLINA')] -= 10;
        case 'RESERVAS EXTRA':
          result[stats.indexOf('INTELECTO')] -= 10;
        case 'AMISTADES PODEROSAS':
          result[stats.indexOf('MOVILIDAD')] += 20;
        case 'CARGA CON PRECISION':
          result[stats.indexOf('DISCIPLINA')] -= 10;
        case 'CARGA DE PRECISION':
          result[stats.indexOf('FUERZA')] -= 10;
        case 'LUZ PROTECTORA':
          result[stats.indexOf('FUERZA')] -= 10;
        case 'LUZ RADIANTE':
          result[stats.indexOf('FUERZA')] += 20;
        case 'CARGA Y RECARGA':
          result[stats.indexOf('RECUPERACION')] -= 10;
        case 'ATAQUE SORPRESA':
          result[stats.indexOf('INTELECTO')] -= 10;
      }
    })
    return result;
  }
}
