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

    private get Cards(): PlayerCards {
        return this.cards;
    }

    /**
     * Move cards from deck to hand
     * @param numCards Number of cards to draw
     * @returns Boolean representing if that many cards were drawn successfully, and the array of card ids
     */
    public draw(numCards: number): [boolean, Array<number>] {
        let drawnCards = this.Cards.draw(numCards);
        return [(drawnCards.length === numCards), drawnCards];
    }

    /**
     * Move cards from deck to shed
     * @param numCards Number of cards to discard
     * @returns Boolean representing if that many cards were shed successfully, and the array of card ids
     */
    public shed(numCards: number): [boolean, Array<number>] {
        let discardedCards = this.Cards.draw(numCards, false);
        return [(discardedCards.length === numCards), discardedCards];
    }

    /**
     * Check player equality
     * Since names and ages can be the same, just compare ids 
     * @param other Another Player
     */
    public equals(other: Player): boolean {
        return this.Id === other.Id;
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