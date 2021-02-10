"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Deck = /** @class */ (function () {
    function Deck() {
    }
    return Deck;
}());
var Player = /** @class */ (function () {
    function Player() {
    }
    Player.prototype.addSunriseEffect = function (id) {
        this.sunriseEffects.add(id);
    };
    Object.defineProperty(Player.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "Age", {
        get: function () {
            return this.age;
        },
        enumerable: false,
        configurable: true
    });
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map