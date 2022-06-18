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
        this.iconURL = iconURL;
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

    public getCaximBalue(values: number[], names: string[]) {
        let sum = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            sum[i] = values[i] + this.getStatByName(names[i]);
        }
        let res = 0;
        sum.forEach(e => {
            let div = e / 10;
            let int = Math.floor(div);
            let cent = (div - int) / 10;
            res += (int + cent);
        })
        return res;
    }

    public getStatByName(name: string) {
        switch (name) {
            case 'MOVILIDAD':
                return this.mobility;
            case 'RESISTENCIA':
                return this.resilience;
            case 'RECUPERACION':
                return this.recovery;
            case 'DISCIPLINA':
                return this.discipline;
            case 'INTELECTO':
                return this.intellect;
            case 'FUERZA':
                return this.strength;
        }
    }

    public setStatByName(value: number, name: string) {
        switch (name) {
            case 'MOVILIDAD':
                this.mobility = value;
            case 'RESISTENCIA':
                this.resilience = value;
            case 'RECUPERACION':
                this.recovery = value;
            case 'DISCIPLINA':
                this.discipline = value;
            case 'INTELECTO':
                this.intellect = value;
            case 'FUERZA':
                this.strength = value;
        }
    }
}
