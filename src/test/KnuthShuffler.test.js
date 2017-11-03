import {KnuthShuffler} from "../KnuthShuffler";
import {Deck} from "../Deck";
import deepFreeze from 'deep-freeze'
import type {Shuffler} from "../Blackjack";
import {toEqualInAnyOrderMatcher} from "./matchers/toEqualInAnyOrder";

it('changes the card order', () => {
    const subject = new KnuthShuffler();
    const beforeShuffle = new Deck();
    deepFreeze(beforeShuffle);

    const afterShuffle = subject.shuffle(beforeShuffle);

    expect(afterShuffle.cards).not.toEqual(beforeShuffle.cards);
    expect(afterShuffle.cards).toEqualInAnyOrder(beforeShuffle.cards);
});