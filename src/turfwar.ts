// This class is reponsible for managing turf war variables. Since turf wars are temporary events,

import { BoostCard } from "./card";
import { PlacedCard } from "./placedcard";
import { Player } from "./player";

//  destroying the related object on turf war completion should be fine.
export class TurfWar {
    // maintain invader/defender data here and perform calculations on turfwar cleanup function
    // just use Card here so we won't have to perform lookup again
    private invadingCard: PlacedCard;
    private defendingCard: PlacedCard;
    // map between user name and boost amount, clear when turf war is over
    // private boostAmounts: Map<string, number>;

    private invadingBoosts: Array<PlacedCard>;
    private defendingBoosts: Array<PlacedCard>;

    private invader: Player;
    private defender: Player;

    private isInvaderTurn: boolean;

    constructor(invadingCard: PlacedCard, invadingPlayer: Player) {
        this.invadingCard = invadingCard;
        // rely on adding the defending player later, in case of situations where there are multiple players
        this.invader = invadingPlayer;

        // this.invadingBoost = 0;
        // this.defendingBoost = 0;
        this.invadingBoosts = [];
        this.defendingBoosts = [];

        // after invader places a card, it's the defender's turn
        this.isInvaderTurn = false;
    }

    public get CurrentPlayer(): Player {
        if (this.isInvaderTurn) {
            return this.invader;
        } else {
            return this.defender;
        }
    }

    public get InvaderBoost(): number {
        // monkaS casting as BoostCard
        return this.invadingBoosts.reduce((accu: number, card: PlacedCard) => accu + (card.Card as BoostCard).Boost, 0);
    }
    
    public get DefenderBoost(): number {
        // monkaS casting as BoostCard
        return this.defendingBoosts.reduce((accu: number, card: PlacedCard) => accu + (card.Card as BoostCard).Boost, 0);
    }

    // todo: add extra effects from rulestext
    public addBoost(card: PlacedCard, player: Player, effect?: any) {
        // // todo: if initialization is performed in the constructor, then this check is unecessary
        // if (!this.boostAmounts.get(player.Id)) {
        //     this.boostAmounts.set(player.Id, 0);
        // }
        // this.boostAmounts.set(player.Id, this.boostAmounts.get(player.Id) + card.Boost);

        if (player.Id === this.invader.Id) {
            // this.invadingBoost += card.Boost;
            this.invadingBoosts.push(card);
        } else if (player.Id === this.defender.Id) {
            // this.defendingBoost += card.Boost;
            this.defendingBoosts.push(card);
        } else {
            console.warn('huh? how did this happen? you passed in the wrong player!');
        }

    }
}