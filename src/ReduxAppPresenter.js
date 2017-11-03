// @flow

import type {AppPresenter, View} from "./App";
import type {GameAction, GameState} from "./BlackjackStateMachine";
import * as Rx from "rxjs";
import type {ViewGameState} from "./StateFormatter";

export interface GameStateMachine {
    startState(): GameState;
    reducer(state: GameState, action: GameAction): GameState;
}

export class ReduxAppPresenter implements AppPresenter {
    store: any;
    stateMachine: GameStateMachine;
    epics: (GameState, GameAction) => Rx.Observable<GameAction>;
    stateFormatter: GameState => ViewGameState;

    constructor(stateMachine: GameStateMachine,
                createStore: ((GameState, GameAction) => GameState, GameState) => any,
                epics: (GameState, ?GameAction) => Rx.Observable<GameAction>,
                stateFormatter: GameState => ViewGameState) {
        this.stateMachine = stateMachine;
        this.epics = epics;
        this.stateFormatter = stateFormatter;
        this.store = createStore(
            this.stateMachine.reducer,
            this.stateMachine.startState()
        );
    }

    attach(view: View): void {
        this.setViewState(view, this.store.getState());
        this.store.subscribe(() => this.setViewState(view, this.store.getState()));
    }

    sendAction(action: GameAction): void {
        this.store.dispatch(action);
        this.epics(this.store.getState(), action).subscribe(action => {
           this.store.dispatch(action);
        });
    }

    setViewState(view: View, state: GameState) {
        view.setState(this.stateFormatter(state));
    }
}