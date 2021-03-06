// @flow
import {Card, suits} from "./Card";
import * as _ from "lodash";

const allCards: Array<Card> = _.flatMap([suits.CLUBS, suits.SPADES, suits.HEARTS, suits.DIAMONDS],
        suit => ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
            .map(value => new Card(suit, value))
    );

export class Deck {
    cards: Array<Card>;

    constructor(cards: Array<Card> = allCards) {
        this.cards = cards;
    }

    draw(numberToDraw: number) {
        if (this.cards.length > 0) {
            return {
                cards: _.slice(this.cards, 0, numberToDraw),
                deck: new Deck(_.slice(this.cards, numberToDraw))
            }
        } else {
            throw new Error("Can't draw from an empty deck!");
        }
    }
}

