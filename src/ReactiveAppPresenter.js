// @flow
import type {AppPresenter, View} from "./App";
import type {GameAction} from "./BlackjackStateMachine";
import * as Rx from "rxjs";
import type {ViewGameState} from "./StateFormatter";

export interface GameLogic {
    playGame(playerActions: Rx.Observable<GameAction>): Rx.Observable<ViewGameState>
}

export class ReactiveAppPresenter implements AppPresenter {
    gameLogic: GameLogic;
    actionSubject = new Rx.Subject();
    scheduler: any;

    constructor(gameLogic: GameLogic, scheduler: any) {
        this.gameLogic = gameLogic;
        this.scheduler = scheduler;
    }

    attach(view: View): void {
        console.log("attaching");
        this.gameLogic.playGame(this.actionSubject.asObservable())
            .concatMap(newState => {
                let newStateObs = Rx.Observable.of(newState);
                if (newState.dealerAction) {
                    return newStateObs.delay(500, this.scheduler);
                } else {
                    return newStateObs;
                }
            })
            .subscribe(
                gameState => {
                    console.log(gameState);
                    view.setState(gameState);
                },
                error => console.log(error)
            );
    }

    sendAction(action: GameAction): void {
        this.actionSubject.next(action);
    }
}