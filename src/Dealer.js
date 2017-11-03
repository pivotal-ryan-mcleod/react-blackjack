// @flow
import type {GameAction, GameState} from "./BlackjackStateMachine";
import type {Person} from "./BlackjackStateMachine";
import {Deck} from "./Deck";
import {calculateHandTotal} from "./HandCalculation";
import {actionTypes} from "./BlackjackStateMachine";
import Rx from 'rxjs/Rx';
import {Scheduler} from "rxjs";
import {Card} from "./Card";

export interface DealerGameState {
    dealer: Person;
    deck: Deck;
}

export function dealerStrategy(state: DealerGameState, action: ?GameAction): Rx.Observable<GameAction> {
    let actions = [];
    if (action != null && action.type === actionTypes.PLAYER_STAY) {
        const deck = state.deck;
        const hand = state.dealer.hand;
        const cardsToDraw = deck.cards
            .reduce((cardsToDraw: Array<Card>, card: Card) => {
                if (calculateHandTotal(hand.concat(cardsToDraw)) < 17) {
                    return cardsToDraw.concat(card);
                } else {
                    return cardsToDraw;
                }
            }, []);
        const bust = calculateHandTotal(hand.concat(cardsToDraw)) > 21;
        actions = cardsToDraw.map(() => {
            return {type: actionTypes.DEALER_HIT}
        });
        if (!bust) {
            actions.push({type: actionTypes.DEALER_STAY});
        }
    }

    return Rx.Observable.from(actions);
}