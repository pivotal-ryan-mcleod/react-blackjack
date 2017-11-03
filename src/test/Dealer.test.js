import {dealerStrategy} from "../Dealer";
import {Deck} from "../Deck";
import {Card, suits} from "../Card";
import type {DealerGameState} from "../Dealer";
import type {GameAction} from "../BlackjackStateMachine";
import {Observable, TestScheduler} from "rxjs";

const actionSymbols = {
    H: {
        'type': 'DEALER_HIT'
    },
    S: {
        'type': 'DEALER_STAY'
    }
};

let testScheduler;

beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });
});

afterEach(() => {
    testScheduler.flush();
});

describe('when the player stays', () => {

    it('hits until reaching 17 or higher', () => {
        let state: DealerGameState = {
            dealer: {
                hand: [new Card(suits.SPADES, '5'), new Card(suits.CLUBS, 'J')]
            },
            deck: new Deck([new Card(suits.DIAMONDS, 'A'), new Card(suits.DIAMONDS, 'A', new Card(suits.CLUBS, 'K'))])
        };
        let returnedActions: Observable<GameAction> = dealerStrategy(Observable.of({type: 'PLAYER_STAY'}), store(state));

        let expectedActionStream = '(HHS|)';
        testScheduler.expectObservable(returnedActions).toBe(expectedActionStream, actionSymbols);
    });

    it('does not hit on a soft 17', () => {
        let state: DealerGameState = {
            dealer: {
                hand: [new Card(suits.SPADES, 'A'), new Card(suits.CLUBS, '6')]
            },
            deck: new Deck([new Card(suits.DIAMONDS, 'A')])
        };
        let returnedActions: Observable<GameAction> = dealerStrategy(Observable.of({type: 'PLAYER_STAY'}), store(state));

        let expectedActionStream = '(S|)';
        testScheduler.expectObservable(returnedActions).toBe(expectedActionStream, actionSymbols);
    });

    it('omits the stay if it busts', () => {
        let state: DealerGameState = {
            dealer: {
                hand: [new Card(suits.SPADES, '10'), new Card(suits.CLUBS, '5')]
            },
            deck: new Deck([new Card(suits.DIAMONDS, 'J')])
        };
        let returnedActions: Observable<GameAction> = dealerStrategy(Observable.of({type: 'PLAYER_STAY'}), store(state));

        let expectedActionStream = '(H|)';
        testScheduler.expectObservable(returnedActions).toBe(expectedActionStream, actionSymbols);
    });
});

function store(state) {
    return {
        getState: () => state
    };
}