export enum Pack {
    madagascar,
    costarica,
    indonesia,
    china
}

export enum Rarity {
    common,
    uncommon,
    endangered,
    rare
}

export enum Border {
    blue,
    yellow,
    orange,
    red,
    purple
}

export enum TrophicLevel {
    primary,
    secondary,
    tertiary,
    quaternary,
    quinary
}

export enum SpeciesType {
    plant,
    mammal,
    reptile,
    bird,
    amphibian,
    invertebrate,
    insect,
    fish
}

// experimenting with keeping function data separate from actual Card instance and using a map or ctor function to generate it
// or using the same map and storing a tuple of both values
// might just make this a factory
// export class CardDataStore {
//     // todo: what is action's type?
//     private store: Map<number, {data: CardData, action: () => void}>;
// }

// Strictly static - no dynamic information like position should be present
// export interface CardData {
//    Id: number;
//    Name: string;
//    Pack: Pack;
//    RulesText: string;
//    FlavorText: string;
//    Rarity: Rarity;
// }

export interface CardBorders {
    top: Border,
    bottom: Border,
    east: Border,
    west: Border
}

// Contains reference to static data, but treat everything else as dynamic
export abstract class Card {
    // private data: CardData;

    // public get Data(): CardData {
    //     return this.data;
    // }

    private id: number;
    private name: string;
    private pack: Pack;
    private rulesText: string;
    private flavorText: string;
    private rarity: Rarity;

    constructor(id: number, name: string, pack: Pack, rulesText: string, flavorText: string, rarity: Rarity) {
        this.id = id;
        this.name = name;
        this.pack = pack;
        this.rulesText = rulesText;
        this.flavorText = flavorText;
        this.rarity = rarity;
    }

    public get Id(): number {
        return this.id;
    }

    public get Name(): string {
        return this.name;
    }

    public get Pack(): Pack {
        return this.pack;
    }

    public get RulesText(): string {
        return this.rulesText;
    }

    public get FlavorText(): string {
        return this.flavorText;
    }

    public get Rarity(): Rarity {
        return this.rarity;
    }
}

export class XekoCard extends Card {
    // this is an array because playing a card will need to check if all tokens are present among
    // the user's played cards - just perform a set lookup
    private tokens: Set<TrophicLevel>;  

    public get Tokens(): Set<TrophicLevel> {
        return this.tokens;
    }
}

export class SpeciesCard extends Card {
    private tokens: Set<TrophicLevel>;
    private energy: number;
    private points: number;
    private speciesType: SpeciesType;
    // want to keep this extensible for non-quad cards (eg hex), but don't worry too much yet
    private borders: CardBorders;

    constructor(id: number, name: string, pack: Pack, rulesText: string, flavorText: string, rarity: Rarity, tokens: Set<TrophicLevel>, energy: number, points: number, speciesType: SpeciesType) {
        super(id, name, pack, rulesText, flavorText, rarity);
        this.tokens = tokens;
        this.energy = energy;
        this.points = points;
        this.speciesType = speciesType;
    }

    public get Tokens(): Set<TrophicLevel> {
        return this.tokens;
    }

    public get Energy(): number {
        return this.energy;
    }

    public get Points(): number {
        return this.points;
    }

    public get SpeciesType(): SpeciesType {
        return this.speciesType;
    }

    // this is the part I'm not sure about - will have to pull out and make a quad card class if diff card shapes are used...
    // agh classes!
    public get Borders(): CardBorders {
        return this.borders;
    }
}

export class BoostCard extends Card {
    // for now, use flat boost values. In the future, change this to a predicate to accomodate for
    // unusual boost values, like in Flock
    private boost: number;
    private borders: CardBorders;

    public get Boost(): number {
        return this.boost;
    }

    public get Borders(): CardBorders {
        return this.borders;
    }
}

export class HotSpotCard extends Card {
    private borders: CardBorders;

    public get Borders(): CardBorders {
        return this.borders;
    }
}