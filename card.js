"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostCard = exports.SpeciesCard = exports.XekoCard = exports.Card = exports.CardDataStore = void 0;
var Pack;
(function (Pack) {
    Pack[Pack["madagascar"] = 0] = "madagascar";
    Pack[Pack["costarica"] = 1] = "costarica";
    Pack[Pack["indonesia"] = 2] = "indonesia";
    Pack[Pack["china"] = 3] = "china";
})(Pack || (Pack = {}));
var Rarity;
(function (Rarity) {
    Rarity[Rarity["common"] = 0] = "common";
    Rarity[Rarity["uncommon"] = 1] = "uncommon";
    Rarity[Rarity["endangered"] = 2] = "endangered";
    Rarity[Rarity["rare"] = 3] = "rare";
})(Rarity || (Rarity = {}));
var Border;
(function (Border) {
    Border[Border["blue"] = 0] = "blue";
    Border[Border["yellow"] = 1] = "yellow";
    Border[Border["orange"] = 2] = "orange";
    Border[Border["red"] = 3] = "red";
    Border[Border["purple"] = 4] = "purple";
})(Border || (Border = {}));
var Token;
(function (Token) {
    Token[Token["primary"] = 0] = "primary";
    Token[Token["secondary"] = 1] = "secondary";
    Token[Token["tertiary"] = 2] = "tertiary";
    Token[Token["quaternary"] = 3] = "quaternary";
    Token[Token["quinary"] = 4] = "quinary";
})(Token || (Token = {}));
// experimenting with keeping function data separate from actual Card instance and using a map or ctor function to generate it
// or using the same map and storing a tuple of both values
// might just make this a factory
var CardDataStore = /** @class */ (function () {
    function CardDataStore() {
    }
    return CardDataStore;
}());
exports.CardDataStore = CardDataStore;
// Contains reference to static data, but treat everything else as dynamic
var Card = /** @class */ (function () {
    function Card() {
    }
    Object.defineProperty(Card.prototype, "Data", {
        get: function () {
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "Borders", {
        // this is the part I'm not sure about - will have to pull out and make a quad card class if diff card shapes are used...
        // agh classes!
        get: function () {
            return this.borders;
        },
        enumerable: false,
        configurable: true
    });
    return Card;
}());
exports.Card = Card;
var XekoCard = /** @class */ (function (_super) {
    __extends(XekoCard, _super);
    function XekoCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XekoCard;
}(Card));
exports.XekoCard = XekoCard;
var SpeciesCard = /** @class */ (function (_super) {
    __extends(SpeciesCard, _super);
    function SpeciesCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SpeciesCard;
}(Card));
exports.SpeciesCard = SpeciesCard;
var BoostCard = /** @class */ (function (_super) {
    __extends(BoostCard, _super);
    function BoostCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BoostCard;
}(Card));
exports.BoostCard = BoostCard;
//# sourceMappingURL=card.js.map