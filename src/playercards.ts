import { getRandomNumber } from "./utils";

// member of Player (composition) or used by Game directly?
// after all, a player is not made up of games!
export class PlayerCards {
    // simply store an array of ids for card data lookup
    private deck: Array<number>;
    private hand: Set<number>;
    private shed: Array<number>;

    constructor(deck: Array<number>) {
        this.deck = deck;
    }

    public get Hand(): Set<number> {
        return this.hand;        
    }

    public get Shed(): Array<number> {
        return this.shed;
    }

    public get DeckSize(): number {
        return this.deck.length;
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

            // ran out of cards to draw
            if (!drawnCard) {
                break;
            }

            drawn.push(drawnCard);
        }

        if (destinationIsHand) {
            for (let drawnCard of drawn) {
                this.hand = this.hand.add(drawnCard);
            }
        } else {
            this.shed = this.shed.concat(drawn);
        }

        return drawn;
    }

    /**
     * Removes a card from the hand
     * @param cardId Id of the card to move
     * @returns The id of the card that was played
     */
    public play(cardId: number, destinationIsShed: boolean = false): number {
        if (!this.Hand.has(cardId)) {
            console.warn('tried to remove card that doesnt exist from hand: ', cardId);
            return null;
        }
        this.Hand.delete(cardId);
        if (destinationIsShed) {
            this.Shed.push(cardId);
        } 
        return cardId;
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
                this.hand.add(foundCard);
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