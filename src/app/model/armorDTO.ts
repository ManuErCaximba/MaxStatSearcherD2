import { ArmorType, ModType } from "./enums";

export class ArmorDTO {

    public id: string;
    public hash: string;
  
    public name: string;
    public iconURL: string;
  
    public mobility: number;
    public resilience: number;
    public recovery: number;
    public discipline: number;
    public intellect: number;
    public strength: number;
  
    public armorType: ArmorType;
    public modEquipped: ModType;
    public masterwork: boolean;
  
    constructor(itemNameIcon: any) {
      this.id = itemNameIcon[0]['Response'].item.data['itemInstanceId'];
      this.hash = itemNameIcon[0]['Response'].item.data['itemHash'];
      this.name = itemNameIcon[1]['name'];
      this.iconURL = itemNameIcon.length == 3 ? 'https://www.bungie.net' + itemNameIcon[2]['icon'] : 'https://www.bungie.net' + itemNameIcon[1]['icon'];
      this.setModType(itemNameIcon[0]['Response'].sockets.data['sockets'][0]['plugHash']);
      this.setArmorType(itemNameIcon[0]['Response'].item.data['bucketHash']);
      this.masterwork = itemNameIcon[0]['Response'].instance.data['energy']['energyCapacity'] == 10 ? true : false;
      this.setMobility(itemNameIcon[0]['Response'].stats.data['stats']['2996146975']);
      this.setResilience(itemNameIcon[0]['Response'].stats.data['stats']['392767087']);
      this.setRecovery(itemNameIcon[0]['Response'].stats.data['stats']['1943323491']);
      this.setDiscipline(itemNameIcon[0]['Response'].stats.data['stats']['1735777505']);
      this.setIntellect(itemNameIcon[0]['Response'].stats.data['stats']['144602215']);
      this.setStrength(itemNameIcon[0]['Response'].stats.data['stats']['4244567218']);
    }

    private setMobility(data) {
        this.mobility = data['value'];
        this.mobility -= this.masterwork ? 2 : 0;
        switch (this.modEquipped) {
            case ("MOBILITY_5"):
                this.mobility -= 5;
                break;
            case ("MOBILITY_10"):
                this.mobility -= 10;
                break;
        }
    }

    private setResilience(data) {
        this.resilience = data['value'];
        this.resilience -= this.masterwork ? 2 : 0;
        switch (this.modEquipped) {
            case ("RESILIENCE_5"):
                this.resilience -= 5;
                break;
            case ("RESILIENCE_10"):
                this.resilience -= 10;
                break;
        }
    }

    private setRecovery(data) {
        this.recovery = data['value'];
        this.recovery -= this.masterwork ? 2 : 0;
        switch (this.modEquipped) {
            case ("RECOVERY_5"):
                this.recovery -= 5;
                break;
            case ("RECOVERY_10"):
                this.recovery -= 10;
                break;
        }
    }

    private setDiscipline(data) {
        this.discipline = data['value'];
        this.discipline -= this.masterwork ? 2 : 0;
        switch (this.modEquipped) {
            case ("DISCIPLINE_5"):
                this.discipline -= 5;
                break;
            case ("DISCIPLINE_10"):
                this.discipline -= 10;
                break;
        }
    }

    private setIntellect(data) {
        this.intellect = data['value'];
        this.intellect -= this.masterwork ? 2 : 0;
        switch (this.modEquipped) {
            case ("INTELLECT_5"):
                this.intellect -= 5;
                break;
            case ("INTELLECT_10"): 
                this.intellect -= 10;
                break;
        }
    }

    private setStrength(data) {
        this.strength = data['value'];
        this.strength -= this.masterwork ? 2 : 0;
        switch (this.modEquipped) {
            case ("STRENGTH_5"):
                this.strength -= 5;
                break;
            case ("STRENGTH_10"):
                this.strength -= 10;
                break;
        }
    }

    private setArmorType(bucketHash: number) {
        switch (bucketHash) {
            case 3448274439:
                this.armorType = ArmorType.HELMET;
                break;
            case 14239492:
                this.armorType = ArmorType.CHEST;
                break;
            case 3551918588:
                this.armorType = ArmorType.GAUNTLETS;
                break;
            case 20886954:
                this.armorType = ArmorType.LEGS;
                break;
        }
    }

    private setModType(plugHash: number) {
        switch (plugHash) {
            case 3961599962:
                this.modEquipped = ModType.MOBILITY_10;
                break;
            case 204137529:
                this.modEquipped = ModType.MOBILITY_5;
                break;
            case 2850583378:
                this.modEquipped = ModType.RESILIENCE_10;
                break;
            case 3682186345:
                this.modEquipped = ModType.RESILIENCE_5;
                break;
            case 2645858828:
                this.modEquipped = ModType.RECOVERY_10;
                break;
            case 555005975:
                this.modEquipped = ModType.RECOVERY_5;
                break;
            case 4048838440:
                this.modEquipped = ModType.DISCIPLINE_10;
                break;
            case 2623485440:
                this.modEquipped = ModType.DISCIPLINE_5;
                break;
            case 3355995799:
                this.modEquipped = ModType.INTELLECT_10;
                break;
            case 1227870362:
                this.modEquipped = ModType.INTELLECT_5;
                break;
            case 3253038666:
                this.modEquipped = ModType.STRENGTH_10;
                break;
            case 3699676109:
                this.modEquipped = ModType.STRENGTH_5;
                break;
            default:
                this.modEquipped = ModType.NONE;
                break;
        }
    }
}
  