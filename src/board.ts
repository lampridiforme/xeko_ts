import { Rarity, TrophicLevel, SpeciesType, Pack, Border } from './enums';
import { Card, CardBorders, HotSpotCard, PlaceableCard, SpeciesCard } from "./card";
import { CardNeighbors, PlacedCard } from "./placedcard";
import { Player } from "./player";

// easily access cards stored in Board via this object
class PlacedCardStore {
    private idToCards: Map<number, PlacedCard>;
    // todo: is there an easy way to do this that doesn't involve keeping coordinate info in both PlacedCard and CardStore?
    private coordToId: Map<[number, number], number>;

    constructor() {
        this.idToCards = new Map();
        this.coordToId = new Map();
    }

    public getCardById(id: number): PlacedCard {
        return this.idToCards.get(id) || null;
    }

    public getCardByCoord(x: number, y: number): PlacedCard {
        let id = this.coordToId.get([x, y]);
        return this.idToCards.get(id) || null;
    }

    public addCard(card: PlacedCard) {
        this.idToCards.set(card.Id, card);
        this.coordToId.set([card.X, card.Y], card.Id);
    }

    public removeCard(id: number): PlacedCard {
        let deletedCard = this.idToCards.get(id);
        this.idToCards.delete(id);
        this.coordToId.delete(this.getCoordById(id));
        return deletedCard;
    }

    public removeCardAtCoord(x: number, y: number): PlacedCard {
        let deletedId = this.coordToId.get([x, y]);
        let deletedCard = this.idToCards.get(deletedId);
        this.idToCards.delete(deletedId);
        this.coordToId.delete([x, y]);
        return deletedCard;
    }

    /**
     * Perform reverse lookup on coordToId to find the coordinates for a card
     * @param idToFind Id to lookup coordinates for
     */
    private getCoordById(idToFind: number): [number, number] {
        let entries = Array.from(this.coordToId.entries());
        return entries.find(([_coordinates, id]) => id === idToFind)[0];
    }

    /**
     * todo: if cards are guaranteed to be species cards and no boost cards are present, then change it from Card to SpeciesCard lookup
     * todo: consider allowing predicates instead of just strict matches
     * @param criteria Properties that must all match for the search to return true. Subcriteria are: cardName, ownerName, trophicLevel, speciesType, borders, cardId, cardPack, and rarity.
     */
    public findSubset({cardName, owner, tokens, speciesType, borders, cardId, cardPack, rarity}: {
        cardName?: string,
        owner?: Player, // todo: change this to ownerID?
        tokens?: Set<TrophicLevel>,
        speciesType?: SpeciesType,
        borders?: CardBorders,
        cardId?: number, 
        cardPack?: Pack,
        rarity?: Rarity,
    }): Array<PlacedCard> {
        let cardArray = Array.from(this.idToCards.values());
        let predicate = (placedCard: PlacedCard): boolean => {
            let genericChecks =   
                (!!cardName ? placedCard.Name === cardName : true) &&
                (!!owner ? placedCard.Owner.equals(owner) : true) &&
                (!!cardId ? placedCard.CardId === cardId : true) &&
                (!!cardPack ? placedCard.Pack === cardPack : true) &&
                (!!rarity ? placedCard.Rarity === rarity : true);
            let speciesChecks =
                (!!speciesType ? (placedCard.Card as SpeciesCard).SpeciesType === speciesType : true) &&
                (!!borders ? (placedCard.Card as SpeciesCard).Borders.equals(borders) : true) &&
                (!!tokens ? (placedCard.Card as SpeciesCard).Tokens === tokens : true)

            return genericChecks && speciesChecks;
        }
        return cardArray.filter(predicate);
    }
}

export class Board {
    // keeps track of the next id to use for a placed card
    private id: number = 0;

    // store card data here
    // not sure if this should just be array<array>. Making it a graph for now to make data storage easier,
    // and moving 2d array to render logic. Only issue is orphan cards, may need to make a lookup function with fake pointers

    // UPDATE: will make this a more robust data structure, but its unecessary to create a 2d array here. Just store coordinate info and make it easy to do lookups on exisitng cards
    private cardStore: PlacedCardStore;

    constructor(origin: HotSpotCard) {
        // https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
        // this.grid = [...Array(w)].map(column => Array(h));
        // this.grid = new Map([[[0, 0], new PlacedCard(this.Id, origin, 0, 0)]]);

        // this.grid = [new PlacedCard(this.Id, origin, 0, 0)];

        let originCard = new PlacedCard(this.Id, origin, 0, 0);
        this.cardStore = new PlacedCardStore();
        this.cardStore.addCard(originCard);
        
    }

    private get Id(): number {
        let id = this.id;
        // i don't like this, but there's no need to be precise with ids here
        this.id += 1;
        return id;
    }

    /**
     * 
     * @param card Card data for the card to place
     * @param x X coordinate to place it at
     * @param y Y coordinate to place it at
     * @param owner Player who owns the card
     * @returns Boolean representing if the card was successfully added (if borders match)
     */
    public placeCard(card: PlaceableCard, x: number, y: number, owner: Player): PlacedCard {
        let neighbors = this.getNeighboringCards(x, y);
        let placedCard = new PlacedCard(this.Id, card, x, y, owner, neighbors);
        if (this.validatePlacement(card, neighbors)) {
            this.cardStore.addCard(placedCard);
            return placedCard;
        } 
        return null;
    }

    public getCardById(id: number): PlacedCard {
        return !!id ? this.cardStore.getCardById(id) : null;
    }

    public getCardsByPlayer(player: Player): Array<PlacedCard> {
        return this.cardStore.findSubset({owner: player}); 
    }

    private validatePlacement(card: PlaceableCard, {top, bottom, left, right}: CardNeighbors): boolean {
        // just create a new set so validateBorder doesn't try to compare a set to null, not sure if this'll cause 
        // issues in the future irt comparing empty bordered cards vs no cards/neighbors at all
        let topNeighbor = this.cardStore.getCardById(top);
        let bottomNeighbor = this.cardStore.getCardById(bottom);
        let leftNeighbor = this.cardStore.getCardById(left);
        let rightNeighbor = this.cardStore.getCardById(right);

        return this.validateBorder(card.Borders.Top, topNeighbor.Borders.Bottom) &&
            this.validateBorder(card.Borders.Bottom, bottomNeighbor.Borders.Top) &&
            this.validateBorder(card.Borders.Left, leftNeighbor.Borders.Right) &&
            this.validateBorder(card.Borders.Right, rightNeighbor.Borders.Left);
    }

    private validateBorder(cardBorder: Set<Border>, neighborBorder: Set<Border>) {
        // check borderless cases first
        if ((cardBorder.size === 0 && neighborBorder.size > 0) || (cardBorder.size > 0 && neighborBorder.size === 0)) {
            return false;
        }

        for (let borderColor in cardBorder) {
            if (neighborBorder.has(Border[borderColor])) {
                return true;
            }
        }
        return false;
    }


    private getNeighboringCards(x: number, y: number): CardNeighbors {
        // let top = this.Grid.find((placedCard) => placedCard.X === x && placedCard.Y === y + 1).Id;
        // let bottom = this.Grid.find((placedCard) => placedCard.X === x && placedCard.Y === y - 1).Id;
        // let left = this.Grid.find((placedCard) => placedCard.X === x - 1 && placedCard.Y === y).Id;
        // let right = this.Grid.find((placedCard) => placedCard.X === x + 1 && placedCard.Y === y).Id;
        let top = this.cardStore.getCardByCoord(x, y+1).Id;
        let bottom = this.cardStore.getCardByCoord(x, y-1).Id;
        let left = this.cardStore.getCardByCoord(x-1, y).Id;
        let right = this.cardStore.getCardByCoord(x+1, y).Id;
        return { top, bottom , left, right };
    }
}