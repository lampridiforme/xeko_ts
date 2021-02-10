"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlacedCard = /** @class */ (function () {
    function PlacedCard(card, owner, neighbors) {
        this.card = card;
        this.owner = !!owner ? owner : null;
        this.neighbors = !!neighbors ? neighbors : { top: null, bottom: null, left: null, right: null };
    }
    Object.defineProperty(PlacedCard.prototype, "Card", {
        get: function () {
            return this.card;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlacedCard.prototype, "Owner", {
        get: function () {
            return this.owner;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlacedCard.prototype, "Neighbors", {
        get: function () {
            return this.neighbors;
        },
        enumerable: false,
        configurable: true
    });
    return PlacedCard;
}());
var Board = /** @class */ (function () {
    function Board(origin) {
        // https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
        // this.grid = [...Array(w)].map(column => Array(h));
        this.grid = [new PlacedCard(origin)];
    }
    Object.defineProperty(Board.prototype, "Grid", {
        get: function () {
            return this.grid;
        },
        enumerable: false,
        configurable: true
    });
    return Board;
}());
// top level logic engine
var Game = /** @class */ (function () {
    function Game(players) {
        this.players = this.sortPlayersByOrder(players);
    }
    /**
     * Sort a player array to determine play order.
     * Younger players go first.
     * @param players Unsorted player array
     */
    Game.prototype.sortPlayersByOrder = function (players) {
        return players.sort(function (a, b) {
            if (a.Age < b.Age) {
                return 1;
            }
            else if (b.Age < a.Age) {
                return -1;
            }
            else {
                return a.Name > b.Name ? 1 : -1;
            }
        });
    };
    Game.prototype.drawCard = function (player) {
    };
    return Game;
}());
//# sourceMappingURL=game.js.map