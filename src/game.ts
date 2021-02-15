import { Board } from './board';
import {BoostCard, HotSpotCard, PlaceableCard, SpeciesCard} from './card';
import { PlacedCard } from './placedcard';
import {Player} from './player';
import { TurfWar } from './turfwar';

// presents to the view the current state of the game
interface GameState {

}

// top level logic engine
class Game implements GameState {
    private board: Board;
    private players: Array<Player>;
    // lookups for card data are performed here
    // private cardDataStore: CardDataStore;

    // dynamic data
    private currentPlayer: number; // index of player array 
    // states can be stored in a dedicated object later
    private drewCard: boolean;
    private sunriseFinished: boolean;
    private playedSpecies: boolean;
    private playedXeko: boolean;
    private turfWar: TurfWar;
    private sunsetCompleted: boolean;

    constructor(players: Array<Player>, hotspotCard: HotSpotCard) {
        // this.players = new Map(this.sortPlayersByOrder(players).map(player => [player.Name, player]));
        this.players = this.sortPlayersByOrder(players);
        this.board = new Board(hotspotCard);
    }

    // allows view to ask whos turn it is
    public get CurrentPlayer(): Player {
        return this.players[this.currentPlayer];
    }

    private get TurfWar(): TurfWar {
        return this.TurfWar;
    }

    private get IsTurfWarActive(): boolean {
        return !!this.TurfWar;
    }

    /**
     * Place a species card on the board. 
     * @param card Species card to place
     * @param x X position of the card relative to origin
     * @param y Y position of the card relative to origin
     * @returns Boolean representing success at placing the card, and current state of the game
     */
    public placeSpeciesCard(card: SpeciesCard, x: number, y: number): [boolean, Game] {
        // todo: pass in player or assign via currentPlayer?
        let placedCard = this.placeCard(card, x, y, this.CurrentPlayer);
        if (!!placedCard) {
            this.playedSpecies = true;
            if (this.isTurfWarInitiated(placedCard)) {
                // todo: need a way to allow defender to select a card to defend with, if there are multiple cards
                this.turfWar = new TurfWar(placedCard, this.CurrentPlayer);
            }
            return [true, this];
        }
        return [false, this];
    }

    public placeBoostCard(card: BoostCard, x: number, y: number, player: Player): [boolean, Game] {
        if (this.IsTurfWarActive) {
            let placedCard = this.placeCard(card, x, y, player);
            this.TurfWar.addBoost(player, card.Boost);
        }
        return [false, this];
    }

    /**
     * Checks if a card's placement position triggers a turf war
     * @param card Newly placed card to check
     * @returns Boolean representing whether a turf war should be started
     */
    private isTurfWarInitiated(card: PlacedCard): boolean {
        let neighbors: Array<PlacedCard> = [
            this.board.getCardById(card.Neighbors.top),
            this.board.getCardById(card.Neighbors.bottom),
            this.board.getCardById(card.Neighbors.left),
            this.board.getCardById(card.Neighbors.right)
        ];
        return neighbors.filter((neighborCard: PlacedCard) => neighborCard.Owner.equals(card.Owner)).length > 0;
    }

    // todo: when does this get called? who calls it?
    private switchPlayer() {

    }

    private placeCard(card: PlaceableCard, x: number, y: number, owner: Player): PlacedCard {
        return this.board.placeCard(card, x, y, owner);
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
