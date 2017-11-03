// @flow

import {Deck} from "./Deck";
import * as _ from "lodash";
import type {Shuffler} from "./Blackjack";

export class KnuthShuffler implements Shuffler {
    shuffle(deck: Deck): Deck {
        let cardsCopy = _.clone(deck.cards);
        let currentIndex = cardsCopy.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = cardsCopy[currentIndex];
            cardsCopy[currentIndex] = cardsCopy[randomIndex];
            cardsCopy[randomIndex] = temporaryValue;
        }
        return new Deck(cardsCopy);
    }
}