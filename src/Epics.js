// @flow
import type {GameAction, GameState} from "./BlackjackStateMachine";
import * as Dealer from "./Dealer";
import * as Rx from "rxjs";

export function rootEpic(actions: Rx.Observable<GameAction>, store: any): Rx.Observable<GameAction> {
    return Dealer.dealerStrategy(actions, store);
}