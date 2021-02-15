// This class is reponsible for managing turf war variables. Since turf wars are temporary events,

import { PlacedCard } from "./placedcard";
import { Player } from "./player";

//  destroying the related object on turf war completion should be fine.
export class TurfWar {
    // maintain invader/defender data here and perform calculations on turfwar cleanup function
    // just use Card here so we won't have to perform lookup again
    private invadingCard: PlacedCard;
    private defendingCard: PlacedCard;
    // map between user name and boost amount, clear when turf war is over
    private boosts: Map<string, number>;

    private players: Array<Player>;

    constructor(invadingCard: PlacedCard, invadingPlayer: Player) {
        this.invadingCard = invadingCard;
        // rely on adding the defending player later, in case of situations where there are multiple players
        this.players = [invadingPlayer];
    }

    // todo: add extra effects from rulestext
    public addBoost(player: Player, boostAmount: number, effect?: any) {
        // todo: if initialization is performed in the constructor, then this check is unecessary
        if (!this.boosts.get(player.Id)) {
            this.boosts.set(player.Id, 0);
        }
        this.boosts.set(player.Id, this.boosts.get(player.Id) + boostAmount)
    }
}