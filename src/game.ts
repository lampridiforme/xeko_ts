import { Board } from './board';
import {BoostCard, HotSpotCard, PlaceableCard, SpeciesCard} from './card';
import { PlacedCard } from './placedcard';
import {Player} from './player';
import { TurfWar } from './turfwar';

// presents to the view the current state of the game
interface GameState {
    Board: Board;
    Players: Array<Player>;
    // lookups for card data are performed here
    // private cardDataStore: CardDataStore;

    // dynamic data
    CurrentPlayer: Player; // index of player array 
    // states can be stored in a dedicated object later
    // definitions are pretty loose - if player chooses to not play a card and confirms this choice, it's set to true
    DrewCard: boolean;
    SunriseFinished: boolean;
    PlayedSpecies: boolean;
    PlayedXeko: boolean;
    TurfWarInitiated: boolean;
    SunsetCompleted: boolean;
}

// top level logic engine
class Game {
    private board: Board;
    private players: Array<Player>;
    // lookups for card data are performed here
    // private cardDataStore: CardDataStore;

    // dynamic data
    private currentPlayer: number; // index of player array 
    // states can be stored in a dedicated object later
    // definitions are pretty loose - if player chooses to not play a card and confirms this choice, it's set to true
    private drewCard: boolean;
    private sunriseFinished: boolean;
    private playedSpecies: boolean;
    private playedXeko: boolean;
    private turfWar: TurfWar;
    private turfWarInitiated: boolean;
    private sunsetCompleted: boolean;

    // assumes players are already initialized, with complete decks
    constructor(players: Array<Player>, hotspotCard: HotSpotCard) {
        // this.players = new Map(this.sortPlayersByOrder(players).map(player => [player.Name, player]));
        this.players = this.sortPlayersByOrder(players);
        // each player draws 5 cards
        for (let player of this.players) {
            let [_res, _cards] = player.draw(5);
        }
        this.board = new Board(hotspotCard);
    }

    private get Board(): Board {
        return this.board;
    }

    private get Players(): Array<Player> {
        return this.players;
    }

    // allows view to ask whos turn it is
    private get CurrentPlayer(): Player {
        return this.players[this.currentPlayer];
    }

    private get CurrentPlayerIndex(): number {
        return this.currentPlayer;
    }

    private set CurrentPlayerIndex(nextIndex: number) {
        this.currentPlayer = nextIndex;
    }

    private get DrewCard(): boolean {
        return this.drewCard;
    }

    private set DrewCard(state: boolean) {
        this.drewCard = state;
    }

    private get SunriseFinished(): boolean {
        return this.sunriseFinished;
    }

    private set SunriseFinished(state: boolean) {
        this.sunriseFinished = state;
    }

    private get PlayedSpecies(): boolean {
        return this.playedSpecies;
    }

    private set PlayedSpecies(state: boolean) {
        this.playedSpecies = state;
    }

    private get PlayedXeko(): boolean {
        return this.playedXeko;
    }

    private set PlayedXeko(state: boolean) {
        this.playedXeko = state;
    }

    private get TurfWarInitiated(): boolean {
        return this.turfWarInitiated;
    }

    private set TurfWarInitated(state: boolean) {
        this.turfWarInitiated = state;
    }

    private get SunsetCompleted(): boolean {
        return this.sunsetCompleted;
    }

    private set SunsetCompleted(state: boolean) {
        this.sunsetCompleted = state;
    }

    private get TurfWar(): TurfWar {
        return this.TurfWar;
    }

    private set TurfWar(turfWar: TurfWar) {
        this.turfWar = turfWar;
    }

    private get IsTurfWarActive(): boolean {
        return !!this.TurfWar;
    }

    // if current player has no actionable turns left - this does not include automatic actions like sunrise/sunset
    private get AreNoActionsLeft(): boolean {
        return this.PlayedSpecies && this.PlayedXeko && !this.IsTurfWarActive;
    }

    // if the current player's turn is over - this includes the sunset phase
    private get IsTurnOver(): boolean {
        return this.drewCard && this.sunriseFinished && this.playedSpecies && this.playedXeko && !this.IsTurfWarActive && this.sunsetCompleted;
    }

    public drawCard(player: Player): [boolean, Game] {
        // todo: where to put this? Need to draw a card but don't know who should initate this action
        let [success, drawnCards] = player.draw(1);
        return [success, this];
    }

    /**
     * Place a species card on the board. 
     * @param card Species card to place
     * @param x X position of the card relative to origin
     * @param y Y position of the card relative to origin
     * @returns Boolean representing success at placing the card, and current state of the game
     */
    public placeSpeciesCard(card: SpeciesCard, x: number, y: number, owner: Player): [boolean, Game] {
        // todo: pass in player or assign via currentPlayer?
        let placedCard = this.placeCard(card, x, y, owner); 
        if (!!placedCard) {
            this.playedSpecies = true;
            // view should read this boolean and know to prompt user to pick a defender
            this.turfWarInitiated = this.isTurfWarInitiated(placedCard); 
            return [true, this];
        }
        this.postTurnCheck();
        return [false, this];
    }

    // goodfaith reliance on view layer to call this at appropriate times    
    public initiateTurfWar(invadingCard: PlacedCard, invader: Player, defendingCard: PlacedCard, defender: Player): Game {
        this.turfWar = new TurfWar(invadingCard, defendingCard, invader, defender);

        this.postTurnCheck();
        return this;
    }

    public placeBoostCard(card: BoostCard, x: number, y: number, player: Player): [boolean, Game] {
        if (this.IsTurfWarActive) {
            let placedCard = this.placeCard(card, x, y, player);
            this.TurfWar.addBoost(placedCard, player);
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

    // call this after each card placement turn - this will set the next player in the Game state
    private postTurnCheck() {
        if (this.IsTurnOver) {
            this.switchPlayer();
        }
    }

    private switchPlayer() {
        this.CurrentPlayerIndex = (this.CurrentPlayerIndex + 1 === this.Players.length) ? 0 : this.CurrentPlayerIndex + 1;
        this.DrewCard = false;
        this.SunriseFinished = false;
        this.PlayedSpecies = false;
        this.PlayedXeko = false;
        this.TurfWarInitated = false;
        this.SunsetCompleted = false;
    }

    private placeCard(card: PlaceableCard, x: number, y: number, owner: Player): PlacedCard {
        return this.board.placeCard(card, x, y, owner);
    }

    private calculateWinner(): Player {
        let winner = this.Players.reduce((accu: {player: Player, total: number}, player: Player) => {
            let conservationBonus: number = Math.ceil(player.DeckSize / 2);
            let boardTotal = this.Board.getCardsByPlayer(player).reduce((accu: number, card: PlacedCard) => accu + (card.Card as SpeciesCard).Points, 0);
            let total = boardTotal + conservationBonus;
            // todo: apply game over effects
            return (!accu.player || total >= accu.total) ? {player, total} : accu;
        }, {player: null, total: 0});
        return winner.player;
    }

    // todo: hook a check for this wherever card draws are involved
    private endGame(): Game {
        this.calculateWinner();
        // todo: assign winner to returned object
        return this;
    }

    // // this mocks a get command, matches key to function and allows post-command logic to run
    // public mockGet(key: string, payload: any) {
    //     // pre-logic stuff
        
    //     switch(key) {
    //         case 'species':
    //             this.placeSpeciesCard();
    //             break;
    //     }

    //     this.postTurnCheck();
    // }

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
