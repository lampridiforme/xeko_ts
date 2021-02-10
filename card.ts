import { isJSDocCommentContainingNode } from "typescript";

enum Pack {
    madagascar,
    costarica,
    indonesia,
    china
}

enum Rarity {
    common,
    uncommon,
    endangered,
    rare
}

enum Border {
    blue,
    yellow,
    orange,
    red,
    purple
}

enum Token {
    primary,
    secondary,
    tertiary,
    quaternary,
    quinary
}

// experimenting with keeping function data separate from actual Card instance and using a map or ctor function to generate it
// or using the same map and storing a tuple of both values
// might just make this a factory
export class CardDataStore {
    // todo: what is action's type?
    private store: Map<number, {data: CardData, action: () => void}>;
}

// Strictly static - no dynamic information like position should be present
export interface CardData {
   Id: number;
   Name: string;
   Pack: Pack;
   RulesText: string;
   FlavorText: string;
   Rarity: Rarity;
}

export interface CardBorders {
    top: Border,
    bottom: Border,
    east: Border,
    west: Border
}

// Contains reference to static data, but treat everything else as dynamic
export class Card {
    private data: CardData;
    // want to keep this extensible for non-quad cards (eg hex), but don't worry too much yet
    private borders: CardBorders;

    public get Data(): CardData {
        return this.data;
    }

    // this is the part I'm not sure about - will have to pull out and make a quad card class if diff card shapes are used...
    // agh classes!
    public get Borders(): CardBorders {
        return this.borders;
    }
}

export class XekoCard extends Card {
    // this is an array because playing a card will need to check if all tokens are present among
    // the user's played cards - just perform a set lookup
    private tokens: Array<Token>;  
}

export class SpeciesCard extends Card {
    private tokens: Array<Token>;
    private energy: number;
    private points: number;
}

export class BoostCard extends Card {
    private energy: number;
}