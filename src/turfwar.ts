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

    /**
     * 
     * @param invadingCard 
     * @param defendingCard The defending species - since the invader determines the defending card, this can be provided at the constructor level
     * @param invadingPlayer 
     * @param defendingPlayer
     */
    constructor(invadingCard: PlacedCard, defendingCard: PlacedCard, invadingPlayer: Player, defendingPlayer: Player) {
        this.invadingCard = invadingCard;
        this.defendingCard = defendingCard;
        
        this.invader = invadingPlayer;
        this.defender = defendingPlayer;

        this.invadingBoosts = [];
        this.defendingBoosts = [];

        // invader begins by placing boosts, if they want
        this.isInvaderTurn = true;
    }

    public get CurrentPlayer(): Player {
        if (this.isInvaderTurn) {
            return this.invader;
        } else {
            return this.defender;
        }
    }

    // afaik only the invader gets the bonus
    // rule book also contradicts itself on how much of a boost is applied per link, or if all
    // colors need to match
    private get InvaderLinkBonus(): number {
        let {top, bottom, left, right} = this.invadingCard.Neighbors;
        let neighborCount = [top, bottom, left, right].reduce((accu: number, neighbor: number) =>
            neighbor !== null ? accu + 1 : accu,
        0);

        switch(neighborCount) {
            case 2:
                return 5;
            case 3:
                return 10;
            case 4:
                return 15;
            default:
                return 0;
        }
    }

    /**
     * Calculate the total amount of boosts from a set of boost cards
     * @param boosts Array of boosts
     */
    private getBoostTotal(boosts: Array<PlacedCard>): number {
        // todo: account for special events
        // monkaS casting as BoostCard
        return boosts.reduce((accu: number, card: PlacedCard) => accu + (card.Card as BoostCard).Boost, 0);
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