// This class is reponsible for managing turf war variables. Since turf wars are temporary events,

import { PlacedCard } from "./placedcard";

//  destroying the related object on turf war completion should be fine.
export class TurfWarInstance {
    // maintain invader/defender data here and perform calculations on turfwar cleanup function
    // just use Card here so we won't have to perform lookup again
    private invadingCard: PlacedCard;
    private defendingCard: PlacedCard;
    // map between user name and boost amount, clear when turf war is over
    private boosts: Map<string, number>;

    constructor(invader: PlacedCard, defender: PlacedCard) {
        this.invadingCard = invader;
        this.defendingCard = defender;
    }

}