import { ArmorType, ClassType, ModType } from "./enums";

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
    public classType: ClassType;
    public isExotic: boolean;

    constructor(
        id: string,
        hash: string,
        name: string,
        iconURL: string,
        mobility: number,
        resilience: number,
        recovery: number,
        discipline: number,
        intellect: number,
        strength: number,
        armorType: ArmorType,
        classType: ClassType,
        isExotic: boolean
    ) {
        this.id = id;
        this.hash = hash;
        this.name = name;
        this.iconURL = 'https://www.bungie.net' + iconURL;
        this.mobility = mobility;
        this.resilience = resilience;
        this.recovery = recovery;
        this.discipline = discipline;
        this.intellect = intellect;
        this.strength = strength;
        this.armorType = armorType;
        this.classType = classType;
        this.isExotic = isExotic;
    }
}
  