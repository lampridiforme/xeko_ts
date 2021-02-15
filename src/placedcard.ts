import { Card, CardBorders, Pack, PlaceableCard, Rarity } from "./card";
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
    private card: PlaceableCard;
    private owner: Player;
    // todo: should neighbors be stored as reference ids or as actual objects? Ids may be safer
    private neighbors: CardNeighbors;

    // coorinates relative to origin
    private x: number;
    private y: number;

    constructor(id: number, card: PlaceableCard, x: number, y: number, owner?: Player, neighbors?: CardNeighbors) {
        this.card = card;
        this.owner = !!owner ? owner : null;
        this.neighbors = !!neighbors ? neighbors : {top: null, bottom: null, left: null, right: null};
        this.x = x;
        this.y = y;
    }

    public get Card(): PlaceableCard {
        return this.card;
    }
    
    public get Id(): number {
        return this.id;
    }

    public get CardId(): number {
        return this.Card.Id;
    }

    public get Name(): string {
        return this.Card.Name;
    }

    public get Pack(): Pack {
        return this.Card.Pack;
    }

    public get RulesText(): string {
        return this.Card.RulesText;
    }

    public get FlavorText(): string {
        return this.Card.FlavorText;
    }

    public get Rarity(): Rarity {
        return this.Card.Rarity;
    }

    public get Owner(): Player {
        return this.owner;
    }

    public get Neighbors(): CardNeighbors {
        return this.neighbors;
    }

    public get Borders(): CardBorders {
        return this.Card.Borders;
    }

    public get X(): number {
        return this.x;
    }

    public get Y(): number {
        return this.y;
    }
}