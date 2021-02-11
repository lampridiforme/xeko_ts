import {Card, CardDataStore} from './card';
import {Player} from './player';

interface CardNeighbors {
    top: PlacedCard;
    bottom: PlacedCard;
    left: PlacedCard;
    right: PlacedCard;
}

class PlacedCard {
    private card: Card;
    private owner: Player;
    private neighbors: CardNeighbors;

    constructor(card: Card, owner?: Player, neighbors?: CardNeighbors) {
        this.card = card;
        this.owner = !!owner ? owner : null;
        this.neighbors = !!neighbors ? neighbors : {top: null, bottom: null, left: null, right: null};
    }

    public get Card(): Card {
        return this.card;
    }

    public get Owner(): Player {
        return this.owner;
    }

    public get Neighbors(): CardNeighbors {
        return this.neighbors;
    }
}

class Board {
    // store card data here
    // not sure if this should just be array<array>. Making it a graph for now to make data storage easier,
    // and moving 2d array to render logic. Only issue is orphan cards, may need to make a lookup function with fake pointers
    private grid: Array<PlacedCard>;

    constructor(origin: Card) {
        // https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
        // this.grid = [...Array(w)].map(column => Array(h));
        this.grid = [new PlacedCard(origin)];
    }

    public get Grid() {
        return this.grid;
    }
}

// top level logic engine
class Game {
    private board: Board;
    private players: Array<Player>;
    // lookups for card data are performed here
    private cardDataStore: CardDataStore;

    // dynamic data
    private currentPlayer: string; // player name
    // states can be stored in a dedicated object later
    private drewCard: boolean;
    private sunriseFinished: boolean;
    private playedSpecies: boolean;
    private playedXeko: boolean;
    private turfWar: boolean;
    private sunsetCompleted: boolean;

    // maintain invader/defender data here and perform calculations on turfwar cleanup function
    // just use Card here so we won't have to perform lookup again
    private invadingCard: PlacedCard;
    private defendingCard: PlacedCard;
    // map between user name and boost amount, clear when turf war is over
    private boosts: Map<string, number>;

    constructor(players: Array<Player>) {
        this.players = this.sortPlayersByOrder(players);
    }

    /**
     * Sort a player array to determine play order.
     * Younger players go first.
     * @param players Unsorted player array
     */
    private sortPlayersByOrder(players: Array<Player>) {
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
