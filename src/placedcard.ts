import { Card, Pack, Rarity } from "./card";
import { Player } from "./player";

export interface CardNeighbors {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export class PlacedCard {
    // each card has a unique id assigned on placement, for now let this be the order of placement
    private id: number;
    private card: Card;
    private owner: Player;
    // todo: should neighbors be stored as reference ids or as actual objects? Ids may be safer
    private neighbors: CardNeighbors;

    // coorinates relative to origin
    private x: number;
    private y: number;

    constructor(id: number, card: Card, x: number, y: number, owner?: Player, neighbors?: CardNeighbors) {
        this.card = card;
        this.owner = !!owner ? owner : null;
        this.neighbors = !!neighbors ? neighbors : {top: null, bottom: null, left: null, right: null};
        this.x = x;
        this.y = y;
    }

    public get Card(): Card {
        return this.card;
    }
    
    public get Id(): number {
        return this.id;
    }

    public get CardId(): number {
        return this.card.Id;
    }

    public get Name(): string {
        return this.card.Name;
    }

    public get Pack(): Pack {
        return this.card.Pack;
    }

    public get RulesText(): string {
        return this.card.RulesText;
    }

    public get FlavorText(): string {
        return this.card.FlavorText;
    }

    public get Rarity(): Rarity {
        return this.card.Rarity;
    }

    public get Owner(): Player {
        return this.owner;
    }

    public get Neighbors(): CardNeighbors {
        return this.neighbors;
    }

    public get X(): number {
        return this.x;
    }

    public get Y(): number {
        return this.y;
    }
}