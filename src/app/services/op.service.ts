import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ArmorDTO } from '../model/armorDTO';
import { ArmorType } from '../model/enums';

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
    let stats = [stat1, stat2, stat3];
    let classMods = statForm.get('mods').value;
    let fragment1 = statForm.get('fragment1').value == '' ? 0 : statForm.get('fragment1').value;
    let fragment2 = statForm.get('fragment2').value == '' ? 0 : statForm.get('fragment2').value;
    let fragment3 = statForm.get('fragment3').value == '' ? 0 : statForm.get('fragment3').value;
    let fragments = [fragment1, fragment2, fragment3];
    let exotic = statForm.get('exotic').value;

    // Setting result values
    let defStat1 = 10 + fragment1;
    let defStat2 = 10 + fragment2;
    let defStat3 = 10 + fragment3;
    if (exotic !== null && exotic !== undefined) {
      defStat1 += exotic.getStatByName(stat1);
      defStat2 += exotic.getStatByName(stat2);
      defStat3 += exotic.getStatByName(stat3);
    }
    if (classMods.length != 0) {
      let modsValues = this.getValueFromMods(classMods, clss, [stat1, stat2, stat3]);
      defStat1 += modsValues[0];
      defStat2 += modsValues[1];
      defStat3 += modsValues[2];
    }
    let purArmor = this.getLegendaryArmor(armorsList, exotic);
    let armorsTypes = [exotic.armorType];
    // Algorithm
    let one: ArmorDTO[] = [];
    let oneMaxC = 0;
    let two: ArmorDTO[] = [];
    let twoMaxC = 0;
    let three: ArmorDTO[] = [];
    let threeMaxC = 0;
    let four: ArmorDTO[] = [];

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
      let xy = ((2 * oneMaxC) + b.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3])) / 3;
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
      let xyz = ((3 * twoMaxC) + c.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3])) / 4;
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
        let xyzt = ((4 * threeMaxC) + d.getCaximBalue([defStat1, defStat2, defStat3], [stat1, stat2, stat3])) / 4;
        if (xyzt > threeMaxC) {
          threeMaxC = xyzt;
          three = [three[0], three[1], three[2], d];
        }
      }
    }

    let results = []
    let combList: ArmorDTO[][] = exotic === undefined ? [one, two, three, four] : [one, two, three];

    combList.forEach(comb => {
      let sum = [defStat1, defStat2, defStat3];
      comb.forEach(a => {
        sum[0] += a.getStatByName(stat1);
        sum[1] += a.getStatByName(stat2);
        sum[2] += a.getStatByName(stat3);
      })
      let mods = this.getMods(sum, [stat1, stat2, stat3]);
      let dummyStats = [
        Math.ceil((100 - sum[0]) / (3 - comb.length)),
        Math.ceil((100 - sum[1]) / (3 - comb.length)),
        Math.ceil((100 - sum[2]) / (3 - comb.length)),
      ]

      this.delimitStats(dummyStats, stats);
      let armorsTypes = [exotic.armorType];
      comb.forEach(c => {
        armorsTypes.push(c.armorType);
      })
      let size = comb.length;
      for (let i = 0; i < 3 - size; i++) {
        let type = this.getArmorType(armorsTypes);
        let icon = this.getDummyIcon(type);
        let dummyArmor = new ArmorDTO(
          null,
          null,
          'Farmear',
          icon,
          0,
          0,
          0,
          0,
          0,
          0,
          type,
          comb[0].classType,
          false
        )
        dummyArmor.setStatByName(dummyStats[0], stat1);
        dummyArmor.setStatByName(dummyStats[1], stat2);
        dummyArmor.setStatByName(dummyStats[2], stat3);
        comb.push(dummyArmor);
      }
      exotic === undefined ? comb : comb.push(exotic);
      results.push([sum, exotic, mods, classMods, fragments, comb, stats])
    })
    return results;
  }

  private delimitStats(dummyStats, stats) {
    let primaries = ['MOVILIDAD', 'RESISTENCIA', 'RECUPERACION'];
    let primariesStat = [
      primaries.indexOf(stats[0]) >= 0 ? true : false,
      primaries.indexOf(stats[1]) >= 0 ? true : false,
      primaries.indexOf(stats[2]) >= 0 ? true : false
    ]
    let pCount = primariesStat.filter(x => x).length;
    let pSum = 0;
    let sSum = 0;
    for (let i = 0; i < primariesStat.length; i++) {
      if (primariesStat[i]) {
        pSum += dummyStats[i];
      } else {
        sSum += dummyStats[i];
      }
    }
    let pOverflow = false;
    let sOverflow = false;
    if (pSum > 34) {
      pSum = (34 / pCount);
      pOverflow = true;
    }
    if (sSum > 34) {
      sSum = (34 / (3 - pCount));
      sOverflow = true;
    }
    for (let i = 0; i < primariesStat.length; i++) {
      if (primariesStat[i] && pOverflow) {
        dummyStats[i] = pSum;
      } else if (!primariesStat[i] && sOverflow) {
        dummyStats[i] = sSum;
      }
    }
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
      if ((exotic === null || (exotic !== null && a.classType === exotic.classType && a.armorType !== exotic.armorType)) && !a.isExotic) {
        res.push(a);
      }
    })
    return res;
  }

  private getArmorType(armorsType) {
    if (armorsType.indexOf('HELMET') < 0) {
      armorsType.push('HELMET');
      return ArmorType.HELMET;
    }
    if (armorsType.indexOf('GAUNTLETS') < 0) {
      armorsType.push('GAUNTLETS');
      return ArmorType.GAUNTLETS;
    }
    if (armorsType.indexOf('CHEST') < 0) {
      armorsType.push('CHEST');
      return ArmorType.CHEST;
    }
    if (armorsType.indexOf('LEGS') < 0) {
      armorsType.push('LEGS');
      return ArmorType.LEGS;
    }
  }

  public getValueFromMods(mods, clss, stats) {
    let result = [0, 0, 0];
    stats.forEach(stat => {
      let i = stats.indexOf(stat);
      switch (stat) {
        case "MOVILIDAD":
          result[i] = mods.indexOf("COSECHADORA DE CARGA") >= 0 && (clss == 1 || clss == "CAZADOR") ? result[i] - 10 : result[i];
          result[i] = mods.indexOf("AMISTADES PODEROSAS") >= 0 ? result[i] + 20 : result[i];
          break;
        case "RESISTENCIA":
          result[i] = mods.indexOf("COSECHADORA DE CARGA") >= 0 && (clss == 0 || clss == "TITAN") ? result[i] - 10 : result[i];
          break;
        case "RECUPERACION":
          result[i] = mods.indexOf("COSECHADORA DE CARGA") >= 0 && (clss == 2 || clss == "HECHICERO") ? result[i] - 10 : result[i];
          result[i] = mods.indexOf("CARGA Y RECARGA") >= 0 ? result[i] - 10 : result[i];
          break;
        case "DISCIPLINA":
          result[i] = mods.indexOf("CONVERSOR DE ENERGIA") >= 0 ? result[i] - 10 : result[i];
          result[i] = mods.indexOf("CARGA CON PRECISION") >= 0 ? result[i] - 10 : result[i];
          break;
        case "INTELECTO":
          result[i] = mods.indexOf("RESERVAS EXTRA") >= 0 ? result[i] - 10 : result[i];
          result[i] = mods.indexOf("ATAQUE SORPRESA") >= 0 ? result[i] - 10 : result[i];
          break;
        case "FUERZA":
          result[i] = mods.indexOf("CARGA DE PRECISION") >= 0 ? result[i] - 10 : result[i];
          result[i] = mods.indexOf("LUZ PROTECTORA") >= 0 ? result[i] - 10 : result[i];
          result[i] = mods.indexOf("LUZ RADIANTE") >= 0 ? result[i] + 20 : result[i];
          break;
      }
    });
    return result;
  }

  private getDummyIcon(type) {
    switch (type) {
      case 'HELMET':
        return 'https://www.bungie.net/common/destiny2_content/icons/9105d456d5e4633a1de3d01f6559025c.jpg';
      case 'GAUNTLETS':
        return 'https://www.bungie.net/common/destiny2_content/icons/daa79bf8275b7bae1c9be02fd844c141.jpg';
      case 'CHEST':
        return 'https://www.bungie.net/common/destiny2_content/icons/6a2477fd9a3c6397fd2743e6e304d53e.jpg';
      case 'LEGS':
        return 'https://www.bungie.net/common/destiny2_content/icons/1f4dd88e866e88f70e06fc63adf23151.jpg';
    }
  }
}
