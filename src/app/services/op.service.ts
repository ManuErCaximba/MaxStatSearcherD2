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

    // Algorithm
    let one = [];
    let oneMaxC = 0;
    let two = [];
    let twoMaxC = 0;
    let three = [];
    let threeMaxC = 0;
    let checkSum = [];
    for (let i = 0; i < purArmor.length; i++) {
      let a = purArmor[i];
      let x = a.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3]);
      if (x > oneMaxC) {
        oneMaxC = x;
        one = [a]
      }
      for (let j = 0; j < purArmor.length; j++) {
        let b = purArmor[j]
        let csj = a.id + b.id;
        if ((i != j) && (a.armorType != b.armorType) && (checkSum.indexOf(csj.toString()) < 0)) {
          let y = b.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3]);
          let xy = (x + y) / 2;
          if (xy > twoMaxC) {
            twoMaxC = xy;
            two = [a, b];
          }
          if (exotic == null || exotic == undefined) {
            for (let k = 0; j < purArmor.length; k++) {
              let c = purArmor[k];
              let csk = c.id + csj;
              if ((i != k) && (j != k) && (a.armorType != c.armorType) && (b.armorType != c.armorType) && (checkSum.indexOf(csk.toString()) < 0)) {
                let z = c.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3]);
                let xyz = (x + y + z) / 3;
                if (xyz > threeMaxC) {
                  threeMaxC = xyz;
                  three = [a, b, c];
                }
              }
              checkSum.push(csk.toString());
            }
          }

        }
        checkSum.push(csj.toString());
      }
    }
    
    // Preparing results
    let results = []
    let threeRes = (exotic == null || exotic == undefined);
    let r;
    if (threeRes) {
      r = this.createResult(three, [defStat1, defStat2, defStat3], [stat1, stat2, stat3])
      results.push(r);
    }
    if (!threeRes || twoMaxC >= threeMaxC) {
      r = this.createResult(two, [defStat1, defStat2, defStat3], [stat1, stat2, stat3])
      results.push(r);
    }
    if (oneMaxC >= twoMaxC) {
      r = this.createResult(two, [defStat1, defStat2, defStat3], [stat1, stat2, stat3])
      results.push(r);
    }
    
    return results;
  }

  private createResult(one, [defStat1, defStat2, defStat3], [stat1, stat2, stat3]) {

  }

  private getLegendaryArmor(armorsList, exotic) {
    let res = [];
    armorsList.forEach(a => {
      if (a.classType !== exotic.classType && !a.isExotic) {
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
