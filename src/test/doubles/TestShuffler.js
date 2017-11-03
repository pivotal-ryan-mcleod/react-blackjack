// @flow
import type {Shuffler} from "../../Blackjack";
import {Deck} from "../../Deck";
import * as _ from "lodash";
import {Card} from "../../Card";

export class TestShuffler implements Shuffler {
    cards : Array<Card>;

    constructor(cards: Array<Card>) {
        this.cards = cards;
    }

    shuffle(deck: Deck): Deck {
        return new TestShuffledDeck(this.cards);
    }
}

class TestShuffledDeck extends Deck {

}