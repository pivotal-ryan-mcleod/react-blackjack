// @flow

import * as _ from "lodash";

export const suits = {
    CLUBS: '♣',
    DIAMONDS: '♦',
    HEARTS: '♥',
    SPADES: '♠'
};
type Suit = $Keys<typeof suits>;
type CardValue = 'A' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export class Card {
    suit: Suit;
    value: CardValue;
    faceUp: boolean;

    constructor(suit: Suit, value: CardValue, faceUp: boolean = true) {
        this.suit = suit;
        this.value = value;
        this.faceUp = faceUp;
    }

    withFaceUp(faceUp: boolean) {
        const copy = _.clone(this);
        copy.faceUp = faceUp;
        return copy;
    }

    toString() {
        return `${this.value}${this.suit}`
    }
}