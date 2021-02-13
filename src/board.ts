import { Card } from "./card";
import { CardNeighbors, PlacedCard } from "./placedcard";
import { Player } from "./player";

export class Board {
    // keeps track of the next id to use for a placed card
    private id: number = 0;

    // store card data here
    // not sure if this should just be array<array>. Making it a graph for now to make data storage easier,
    // and moving 2d array to render logic. Only issue is orphan cards, may need to make a lookup function with fake pointers

    // UPDATE: will make this a more robust data structure, but its unecessary to create a 2d array here. Just store coordinate info and make it easy to do lookups on exisitng cards
    private grid: Array<PlacedCard>;

    constructor(origin: Card) {
        // https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
        // this.grid = [...Array(w)].map(column => Array(h));
        this.grid = [new PlacedCard(this.Id, origin, 0, 0)];
        // this.grid = new Map([[[0, 0], new PlacedCard(this.Id, origin, 0, 0)]]);
        
    }

    public get Grid() {
        return this.grid;
    }

    private get Id(): number {
        let id = this.id;
        // i don't like this, but there's no need to be precise with ids here
        this.id += 1;
        return id;
    }

    public placeCard(card: Card, x: number, y: number, owner: Player): boolean {
        let neighbors = this.getNeighboringCards(x, y);
        let placedCard = new PlacedCard(this.Id, card, x, y, owner, neighbors);
        // todo: reminder that this function doesn't work yet
        return this.validatePlacement(card, neighbors);
    }

    private validatePlacement(card: Card, neighbors: CardNeighbors): boolean {
        // todo: do validation here based on border colors
        return true;
    }

    private getNeighboringCards(x: number, y: number): CardNeighbors {
        let top = this.Grid.find((placedCard) => placedCard.X === x && placedCard.Y === y + 1).Id;
        let bottom = this.Grid.find((placedCard) => placedCard.X === x && placedCard.Y === y - 1).Id;
        let left = this.Grid.find((placedCard) => placedCard.X === x - 1 && placedCard.Y === y).Id;
        let right = this.Grid.find((placedCard) => placedCard.X === x + 1 && placedCard.Y === y).Id;
        return { top, bottom , left, right };
    }
}