import {Deck} from "../Deck";
import {Card, suits} from "../Card";
import deepFreeze from 'deep-freeze'
import * as _ from "lodash";
import {ALL_CARDS_SORTED} from "./fixtures/DeckFixtures";

it('contains all legal playing cards by default', () => {
    let subject = new Deck();

    expect(subject.cards).toEqualInAnyOrder(ALL_CARDS_SORTED);
});

describe('drawing', () => {
    describe('if the deck is non-empty', () => {
        it('returns the top card and a new deck with the card removed', () => {
            let subject = new Deck([
                new Card(suits.SPADES, '5'),
                new Card(suits.CLUBS, '4'),
                new Card(suits.DIAMONDS, 'K'),
                new Card(suits.HEARTS, '8'),
            ]);
            deepFreeze(subject);

            const result = subject.draw(3);

            expect(result).toEqual({
                cards: [
                    new Card(suits.SPADES, '5'),
                    new Card(suits.CLUBS, '4'),
                    new Card(suits.DIAMONDS, 'K')
                ],
                deck: new Deck([new Card(suits.HEARTS, '8')])
            })
        });
    });

    describe('if the deck is empty', () => {
        it('throws an exception', () => {
            expect(() => {
                new Deck([]).draw();
            }).toThrow();
        });
    });
})