import { PlayerCards } from './playercards';

export class Player {
    // todo: each player also needs a unique id, unless names are guaranteed to be unique
    // maybe pull this out into a PlayerData?
    private name: string;
    private age: number; // needed for zodiac card and play order

    private cards: PlayerCards;

    // an array of function/card lookup ids for sunrise effects
    private sunriseEffects: Set<number>;
    private sunsetEffects: Set<number>;

    constructor(name: string, age: number, deck: Array<number>) {
        this.name = name;
        this.age = age;
        this.cards = new PlayerCards(deck);
    }

    // for now, just use name as id
    public get Id(): string {
        return this.Name;
    }

    public get Name(): string {
        return this.name;
    }

    public get Age(): number {
        return this.age;
    }

    public equals(other: Player) {
        return this.Name === other.Name;
    }

    /**
     * 
     * @param id Id of card with the sunrise effect
     */
    public addSunriseEffect(id: number): void {
        this.sunriseEffects.add(id);
    }

    /**
     * 
     * @param id Id of the card with the sunset effect
     */
    public addSunsetEffect(id: number): void {
        this.sunsetEffects.add(id);
    }
}