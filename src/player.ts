import { getRandomNumber } from "./utils";

class PlayerCards {
    // simply store an array of ids for card data lookup
    private deck: Array<number>;
    private hand: Array<number>;
    private shed: Array<number>;

    constructor(deck: Array<number>) {
        this.deck = deck;
    }

    public get Hand(): Array<number> {
        return this.hand;        
    }

    public get Shed(): Array<number> {
        return this.shed;
    }

    /**
     * Draws a number of cards from the deck and places it into the destination
     * @param numCards Number of cards to draw from deck
     * @param destinationIsHand True if it should be drawn to hand, false if it should be drawn to shed
     * @returns Array of drawn card ids
     */
    public draw(numCards: number, destinationIsHand: boolean = true): Array<number> {
        let drawn = [];
        for (let drawCount = 0; drawCount < numCards; drawCount++) {
            let drawnCard = this.deck.pop();
            drawn.push(drawnCard);
        }

        if (destinationIsHand) {
            this.hand = this.hand.concat(drawn);
        } else {
            this.shed = this.shed.concat(drawn);
        }

        return drawn;
    }

    /**
     * Draws a single card from the deck matching the given id
     * @param cardId Id of the card that should be drawn
     * @returns Array containing the drawn card, or blank array if no card with that id was found 
     */
    public drawCardById(cardId: number, destinationIsHand: boolean = true): Array<number> {
        let foundCard = this.deck.find(id => id === cardId);
        // todo: check if this causes problems when id === 0
        if (!!foundCard) {
            if (destinationIsHand) {
                this.hand.push(foundCard);
            } else {
                this.shed.push(foundCard);
            }
            return [foundCard];
        }
        return [];
    }

    /**
     * Add a card to the deck
     * @param cardId Card to add to deck
     * @param shuffleIn If the card should be shuffled into a random deck position, defaults to true
     */
    public addCard(cardId: number, shuffleIn: boolean = true) {
        if (shuffleIn) {
            getRandomNumber(0, this.deck.length);
        } else {
            // todo: also check if it makes sense to unshift
            this.deck.unshift(cardId);
        }
    }

    // shuffle the current collection
	shuffle() { // from: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	    let a = this.deck;
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	    return a;
	}
}

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

    public get Name(): string {
        return this.name;
    }

    public get Age(): number {
        return this.age;
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