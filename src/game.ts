import { Board } from './board';
import {Card, CardDataStore} from './card';
import { PlacedCard } from './placedcard';
import {Player} from './player';

// This class is reponsible for managing turf war variables. Since turf wars are temporary events,
//  destroying the related object on turf war completion should be fine.
class TurfWarInstance {
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

// top level logic engine
class Game {
    private board: Board;
    private players: Array<Player>;
    // lookups for card data are performed here
    private cardDataStore: CardDataStore;

    // dynamic data
    private currentPlayer: number; // index of player array 
    // states can be stored in a dedicated object later
    private drewCard: boolean;
    private sunriseFinished: boolean;
    private playedSpecies: boolean;
    private playedXeko: boolean;
    private turfWar: TurfWarInstance;
    private sunsetCompleted: boolean;

    constructor(players: Array<Player>, biomeCard: Card) {
        // this.players = new Map(this.sortPlayersByOrder(players).map(player => [player.Name, player]));
        this.players = this.sortPlayersByOrder(players);
        this.board = new Board(biomeCard);
    }

    // allows view to ask whos turn it is
    public get CurrentPlayer(): Player {
        return this.players[this.currentPlayer];
    }

    private get TurfWar(): TurfWarInstance {
        return this.TurfWar;
    }

    private get IsTurfWarActive(): boolean {
        return !!this.TurfWar;
    }

    public placeCard(card: Card, x: number, y: number, owner: Player): [boolean, Game] {
        let success = this.board.placeCard(card, x, y, owner)
        // reevaluate if an entire Game object is a smart thing to return
        return [success, this];
    }

    /**
     * Sort a player array to determine play order.
     * Younger players go first.
     * @param players Unsorted player array
     */
    private sortPlayersByOrder(players: Array<Player>): Array<Player> {
        return players.sort((a: Player, b: Player) => {
            if (a.Age < b.Age) {
                return 1;
            } else if (b.Age < a.Age) {
                return -1;
            } else {
                return a.Name > b.Name ? 1 : -1;
            }
        });
    }

}
