import {Blackjack} from "../Blackjack";
import {TestScheduler} from "rxjs";
import {ShuffledDeck, TestShuffler} from "./doubles/TestShuffler";
import {Card} from "../Card";
import {ALL_CARDS_SORTED, DEALER_BUST_SCENARIO} from "./fixtures/DeckFixtures";

const actionSymbols = {
    H: {
        'type': 'PLAYER_HIT'
    },
    S: {
        'type': 'PLAYER_STAY'
    }
};

let subject;
let testScheduler;
beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });
    subject = new Blackjack(new TestShuffler(ALL_CARDS_SORTED));
});

afterEach(() => {
    testScheduler.flush();
});

it('player hits until bust', () => {
    let actionStream = '^HHH';
    let expectedStateStream = 'Dabc';
    let expectedPlayerStates = {
        D: {hand: [new Card('♦', 'A'), new Card('♦', '3')], total: '14', bust: false},
        a: {hand: [new Card('♦', 'A'), new Card('♦', '3'), new Card('♦', '5')], total: '19', bust: false},
        b: {
            hand: [new Card('♦', 'A'), new Card('♦', '3'), new Card('♦', '5'), new Card('♦', '6')],
            total: '15',
            bust: false
        },
        c: {
            hand: [new Card('♦', 'A'), new Card('♦', '3'), new Card('♦', '5'), new Card('♦', '6'), new Card('♦', '7')],
            total: '22',
            bust: true
        }
    };

    let stateStream = subject.playGame(testScheduler.createHotObservable(actionStream, actionSymbols));
    testScheduler.expectObservable(stateStream.map(s => s.player)).toBe(expectedStateStream, expectedPlayerStates);
    testScheduler.expectObservable(stateStream.map(s => s.winner).skipWhile(winner => winner === 'NONE')).toBe('---W', {W: 'DEALER'});
});

it('player stays at 14 and loses', () => {
    let actionStream = '^S';
    let expectedStateStream = 'D(abcd)'; // Dealer actions occur instantaneously when player stays
    let expectedDealerStates = {
        D: {hand: [new Card('♦', '2', true), new Card('♦', '4', false)], total: '', bust: false},
        a: {hand: [new Card('♦', '2', true), new Card('♦', '4', true)], total: '6', bust: false}, // dealer reveals hand
        b: {hand: [new Card('♦', '2'), new Card('♦', '4'), new Card('♦', '5')], total: '11', bust: false}, // dealer hits
        c: {
            hand: [new Card('♦', '2'), new Card('♦', '4'), new Card('♦', '5'), new Card('♦', '6')],
            total: '17',
            bust: false
        }, // dealer hits
        d: {
            hand: [new Card('♦', '2'), new Card('♦', '4'), new Card('♦', '5'), new Card('♦', '6')],
            total: '17',
            bust: false
        }, // dealer stays
    };

    let stateStream = subject.playGame(testScheduler.createHotObservable(actionStream, actionSymbols));
    testScheduler.expectObservable(stateStream.map(s => s.dealer)).toBe(expectedStateStream, expectedDealerStates);
    testScheduler.expectObservable(stateStream.map(s => s.winner).skipWhile(winner => winner === 'NONE')).toBe('-W', {W: 'DEALER'});
});

it('player stays and dealer busts', () => {
    subject = new Blackjack(new TestShuffler(DEALER_BUST_SCENARIO));
    let actionStream = '^S';
    let expectedStateStream = 'D(abc)';
    let expectedDealerStates = {
        D: {hand: [new Card('♦', '2', true), new Card('♦', '4', false)], total: '', bust: false},
        a: {hand: [new Card('♦', '2', true), new Card('♦', '4', true)], total: '6', bust: false}, // dealer reveals hand
        b: {hand: [new Card('♦', '2'), new Card('♦', '4'), new Card('♦', 'J')], total: '16', bust: false}, // dealer hits
        c: {
            hand: [new Card('♦', '2'), new Card('♦', '4'), new Card('♦', 'J'), new Card('♦', 'K')],
            total: '26',
            bust: true
        }, // dealer busts
    };

    let stateStream = subject.playGame(testScheduler.createHotObservable(actionStream, actionSymbols));
    testScheduler.expectObservable(stateStream.map(s => s.dealer)).toBe(expectedStateStream, expectedDealerStates);
    testScheduler.expectObservable(stateStream.map(s => s.winner).skipWhile(winner => winner === 'NONE')).toBe('-W', {W: 'PLAYER'});
});