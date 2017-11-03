import {BlackjackStateMachine} from "../BlackjackStateMachine";
import {TestShuffler} from "./doubles/TestShuffler";
import {
    ALL_CARDS_SORTED, BOTH_NATURAL_21_SCENARIO, DEALER_NATURAL_21_SCENARIO,
    PLAYER_NATURAL_21_SCENARIO
} from "./fixtures/DeckFixtures";
import {Card, suits} from "../Card";
import {Deck} from "../Deck";

let subject;
beforeEach(() => {
    subject = new BlackjackStateMachine(new TestShuffler(ALL_CARDS_SORTED));
});

describe('when the game starts', () => {
    it('shuffles the deck and deals out two cards to the dealer and the player (dealer gets one face down)', () => {
        expect(subject.startState()).toEqual({
            deck: new Deck(ALL_CARDS_SORTED.slice(4)),
            player: {
                hand: [
                    new Card('♦', 'A', true),
                    new Card('♦', '3', true)
                ],
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '4', false)
                ]
            },
            winner: 'NONE',
            playerDone: false,
            dealerAction: false
        });
    });

    it('declares the player the winner if they draw a natural 21', () => {
        subject = new BlackjackStateMachine(new TestShuffler(PLAYER_NATURAL_21_SCENARIO));

        expect(subject.startState()).toEqual({
            deck: new Deck(PLAYER_NATURAL_21_SCENARIO.slice(4)),
            player: {
                hand: [
                    new Card('♦', 'A', true),
                    new Card('♦', 'J', true)
                ],
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '3', true)
                ]
            },
            winner: 'PLAYER',
            playerDone: true,
            dealerAction: false
        });
    });

    it('declares the dealer the winner if they draw a natural 21', () => {
        subject = new BlackjackStateMachine(new TestShuffler(DEALER_NATURAL_21_SCENARIO));

        expect(subject.startState()).toEqual({
            deck: new Deck(DEALER_NATURAL_21_SCENARIO.slice(4)),
            player: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '3', true)
                ],
            },
            dealer: {
                hand: [
                    new Card('♦', 'A', true),
                    new Card('♦', 'J', true)
                ]
            },
            winner: 'DEALER',
            playerDone: true,
            dealerAction: false
        });
    });

    it('declares a draw if both the player and the dealer draw a natural 21', () => {
        subject = new BlackjackStateMachine(new TestShuffler(BOTH_NATURAL_21_SCENARIO));

        expect(subject.startState()).toEqual({
            deck: new Deck(BOTH_NATURAL_21_SCENARIO.slice(4)),
            player: {
                hand: [
                    new Card('♣', 'A', true),
                    new Card('♦', 'J', true)
                ],
            },
            dealer: {
                hand: [
                    new Card('♦', 'A', true),
                    new Card('♣', 'Q', true)
                ]
            },
            winner: 'DRAW',
            playerDone: true,
            dealerAction: false
        });
    });
});

describe('when the player hits', () => {
    it('deals a card to the player', () => {
        const previousState = {
            deck: new Deck([new Card(suits.CLUBS, 'J')]),
            player: {
                hand: []
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '4', false)
                ],
            },
            winner: 'NONE',
            playerDone: false,
            dealerAction: false
        };

        const nextState = subject.reducers(previousState, {type: 'PLAYER_HIT'});

        expect(nextState).toEqual({
            deck: new Deck([]),
            player: {
                hand: [
                    new Card(suits.CLUBS, 'J')
                ]
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '4', false)
                ]
            },
            winner: 'NONE',
            playerDone: false,
            dealerAction: false
        });
    });

    it("reveals the dealer's hand if the player busts and declares the dealer the winner", () => {
        const previousState = {
            deck: new Deck([new Card(suits.CLUBS, 'J')]),
            player: {
                hand: [
                    new Card('♦', 'J', true),
                    new Card('♦', '3', true)
                ]
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '4', false)
                ]
            },
            winner: 'NONE',
            playerDone: false,
            dealerAction: false
        };

        const nextState = subject.reducers(previousState, {type: 'PLAYER_HIT'});

        expect(nextState).toEqual({
            deck: new Deck([]),
            player: {
                hand: [
                    new Card('♦', 'J', true),
                    new Card('♦', '3', true),
                    new Card(suits.CLUBS, 'J')
                ]
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '4', true)
                ]
            },
            winner: 'DEALER',
            playerDone: true,
            dealerAction: false
        });
    });
});

describe('when the player stays', () => {
    it("reveals the dealer's hand", () => {
        const previousState = {
            deck: new Deck([]),
            player: {
                hand: []
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '4', false)
                ]
            },
            winner: 'NONE',
            playerDone: false,
            dealerAction: false
        };

        const nextState = subject.reducers(previousState, {type: 'PLAYER_STAY'});

        expect(nextState).toEqual({
            deck: new Deck([]),
            player: {
                hand: []
            },
            dealer: {
                hand: [
                    new Card('♦', '2', true),
                    new Card('♦', '4', true)
                ]
            },
            winner: 'NONE',
            playerDone: true,
            dealerAction: false
        });
    })
});

describe('when the dealer hits', () => {
    it('deals another card to the dealer', () => {
        const previousState = {
            deck: new Deck([new Card('♦', '6')]),
            player: {
                hand: []
            },
            dealer: {
                hand: [
                    new Card('♦', '2'),
                    new Card('♦', '4')
                ]
            },
            winner: 'NONE',
            playerDone: true,
            dealerAction: false
        };

        const nextState = subject.reducers(previousState, {type: 'DEALER_HIT'});

        expect(nextState).toEqual({
            deck: new Deck([]),
            player: {
                hand: []
            },
            dealer: {
                hand: [
                    new Card('♦', '2'),
                    new Card('♦', '4'),
                    new Card('♦', '6')
                ]
            },
            winner: 'NONE',
            playerDone: true,
            dealerAction: true
        })
    });

    it('busts if the dealer gets more than 21', () => {
        const previousState = {
            deck: new Deck([new Card('♦', 'J')]),
            player: {
                hand: []
            },
            dealer: {
                hand: [
                    new Card('♦', '5'),
                    new Card('♦', '10')
                ]
            },
            winner: 'NONE',
            playerDone: true,
            dealerAction: false
        };

        const nextState = subject.reducers(previousState, {type: 'DEALER_HIT'});

        expect(nextState).toEqual({
            deck: new Deck([]),
            player: {
                hand: []
            },
            dealer: {
                hand: [
                    new Card('♦', '5'),
                    new Card('♦', '10'),
                    new Card('♦', 'J')
                ]
            },
            winner: 'PLAYER',
            playerDone: true,
            dealerAction: true
        })

    });
});

describe('when the dealer stays', () => {
    let previousState;

    beforeEach(() => {
        previousState = {
            deck: new Deck([]),
            player: {
                hand: []
            },
            dealer: {
                hand: []
            },
            winner: 'NONE',
            playerDone: true,
            dealerAction: false
        };
    });

    it('declares the player the winner if the player score is higher', () => {
        previousState.player = {
            hand: [
                new Card('♦', '2'),
                new Card('♦', '4'),
                new Card('♦', '6')
            ]
        };

        const nextState = subject.reducers(previousState, {type: 'DEALER_STAY'});

        expect(nextState.dealerAction).toBe(true);
        expect(nextState.winner).toEqual('PLAYER');
    });

    it('declares the dealer the winner if the dealer score is higher', () => {
        previousState.dealer = {
            hand: [
                new Card('♦', '2'),
                new Card('♦', '4'),
                new Card('♦', '6')
            ]
        };

        const nextState = subject.reducers(previousState, {type: 'DEALER_STAY'});

        expect(nextState.dealerAction).toBe(true);
        expect(nextState.winner).toEqual('DEALER');
    });

    it('declares a draw if the dealer and player score are the same', () => {
        const nextState = subject.reducers(previousState, {type: 'DEALER_STAY'});

        expect(nextState.dealerAction).toBe(true);
        expect(nextState.winner).toEqual('DRAW');
    });
});