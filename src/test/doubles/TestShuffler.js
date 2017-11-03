// @flow
import {Deck} from "../../Deck";
import {Card} from "../../Card";
import type {Shuffler} from "../../BlackjackStateMachine";

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