// @flow
import {Observable} from "rxjs";
import {Deck} from "./Deck";
import type {GameAction, GameState} from "./BlackjackStateMachine";
import {BlackjackStateMachine} from "./BlackjackStateMachine";
import type {ViewGameState} from "./StateFormatter";
import {stateFormatter} from "./StateFormatter";
import type {GameLogic} from "./ReactiveAppPresenter";
import {epics} from "./Epics";

export interface Shuffler {
    shuffle(deck: Deck): Deck;
}

class ScannedState {
    gameState: GameState;
    lastAction: ?GameAction;

    constructor(gameState: GameState, lastAction: ?GameAction = null) {
        this.gameState = gameState;
        this.lastAction = lastAction;
    }
}

export class Blackjack implements GameLogic {
    stateMachine: BlackjackStateMachine;

    constructor(shuffler: Shuffler) {
        this.stateMachine = new BlackjackStateMachine(shuffler);
    }

    playGame(playerActions: Observable<GameAction>): Observable<ViewGameState> {
        let startState: GameState = this.stateMachine.startState();
        return playerActions
            .scan(this.scannedStateReducer, new ScannedState(startState, null))
            .flatMap((scannedState: ScannedState): Observable<ScannedState> => {
                return epics(scannedState.gameState, scannedState.lastAction)
                    .scan(this.scannedStateReducer, scannedState)
                    .startWith(scannedState);
            })
            .map(scannedState => scannedState.gameState)
            .startWith(startState)
            .map(stateFormatter);
    }

    scannedStateReducer = (scannedState: ScannedState, action: GameAction): ScannedState => {
        return new ScannedState(this.stateMachine.reducers(scannedState.gameState, action), action);
    };
}



