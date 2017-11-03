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

export function dealerStrategy(actions: Rx.Observable<GameAction>, store: any): Rx.Observable<GameAction> {
    return actions
        .filter(action => action.type === actionTypes.PLAYER_STAY)
        .flatMap(() => {
            const state = store.getState();
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
            let dealerActions = cardsToDraw
                .map(() => {
                    return {type: actionTypes.DEALER_HIT}
                });
            if (calculateHandTotal(hand.concat(cardsToDraw)) <= 21) {
                dealerActions.push({type: actionTypes.DEALER_STAY});
            }
            return dealerActions;
        });
}