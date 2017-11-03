// @flow
import type {GameAction, GameState} from "./BlackjackStateMachine";
import * as Dealer from "./Dealer";
import * as Rx from "rxjs";

export function epics(state: GameState, action: ?GameAction): Rx.Observable<GameState> {
    return Dealer.dealerStrategy(state, action);
}