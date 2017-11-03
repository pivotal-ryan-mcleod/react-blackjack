// @flow

import type {AppPresenter, View} from "./App";
import type {GameAction, GameState} from "./BlackjackStateMachine";
import type {ViewGameState} from "./StateFormatter";

export interface GameStateMachine {
    startState(): GameState;
    reducer(state: GameState, action: GameAction): GameState;
}

type StoreCreator = ((GameState, GameAction) => GameState, GameState) => any
export type StateFormatter = GameState => ViewGameState;

export class ReduxAppPresenter implements AppPresenter {
    store: any;
    stateMachine: GameStateMachine;
    stateFormatter: StateFormatter;

    constructor(stateMachine: GameStateMachine,
                createStore: StoreCreator,
                stateFormatter: StateFormatter) {
        this.stateMachine = stateMachine;
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
    }

    setViewState(view: View, state: GameState) {
        view.setState(this.stateFormatter(state));
    }
}