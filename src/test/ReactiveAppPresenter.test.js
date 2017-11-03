// @flow
import type {View} from "../App";
import type {GameAction} from "../BlackjackStateMachine";
import type {ViewGameState} from "../StateFormatter";
import {Observable, ReplaySubject, VirtualTimeScheduler} from "rxjs";
import {ReactiveAppPresenter} from "../ReactiveAppPresenter";
import {actionTypes} from "../BlackjackStateMachine";

let viewSpy: ViewSpy;
let gameLogicDouble: GameLogicDouble;
let subject: ReactiveAppPresenter;
let scheduler: VirtualTimeScheduler;

beforeEach(() => {
    viewSpy = new ViewSpy();
    gameLogicDouble = new GameLogicDouble();
    scheduler = new VirtualTimeScheduler();
    subject = new ReactiveAppPresenter(gameLogicDouble, scheduler);

    subject.attach(viewSpy);
});

it('sets the game state on the view according to game logic', () => {
    gameLogicDouble.gameStateSubject.next({"hi": "I'm state!"});

    expect(viewSpy.stateChanges).toEqual([{"hi": "I'm state!"}]);
});

it('slow rolls state changes caused by dealer actions', () => {
    gameLogicDouble.gameStateSubject.next({
        "hi": "I'm state!",
        dealerAction: true
    });
    expect(viewSpy.stateChanges).toEqual([]);

    scheduler.flush();

    expect(viewSpy.stateChanges).toEqual([{
        "hi": "I'm state!",
        dealerAction: true
    }]);
});

it('keeps state changes in correct order when there\'s a delay', () => {
    gameLogicDouble.gameStateSubject.next({
        "hi": "I'm the delayed state change!",
        dealerAction: true
    });
    gameLogicDouble.gameStateSubject.next({
        "hi": "I'm the second state change!"
    });

    expect(viewSpy.stateChanges).toEqual([]);

    scheduler.flush();

    expect(viewSpy.stateChanges).toEqual([{
        "hi": "I'm the delayed state change!",
        dealerAction: true
    }, {
        "hi": "I'm the second state change!"
    }]);
});

it('sends actions', () => {
    subject.sendAction({type: actionTypes.PLAYER_HIT});

    expect(gameLogicDouble.receivedActions).toEqual([{type: actionTypes.PLAYER_HIT}]);
});

class ViewSpy implements View {
    stateChanges: Array<ViewGameState> = [];

    setState(state: ViewGameState): void {
        this.stateChanges.push(state);
    }
}

class GameLogicDouble {
    receivedActions: Array<GameAction> = [];
    gameStateSubject: ReplaySubject<ViewGameState> = new ReplaySubject();

    playGame(playerActions: Observable<GameAction>): Observable<ViewGameState> {
        playerActions.subscribe(action => {
            this.receivedActions.push(action);
        });
        return this.gameStateSubject.asObservable();
    }
}