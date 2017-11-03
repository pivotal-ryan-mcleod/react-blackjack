import {ReduxAppPresenter} from "../ReduxAppPresenter";
import {actionTypes, BlackjackStateMachine} from "../BlackjackStateMachine";
import {createStore} from "redux";
import type {View} from "../App";
import type {ViewGameState} from "../StateFormatter";
import {stateFormatter} from "../StateFormatter";
import {TestShuffler} from "./doubles/TestShuffler";
import {ALL_CARDS_SORTED} from "./fixtures/DeckFixtures";

let subject: ReduxAppPresenter;
let view: ViewSpy;
const stateMachine = new BlackjackStateMachine(new TestShuffler(ALL_CARDS_SORTED));

beforeEach(() => {
    view = new ViewSpy();
    subject = new ReduxAppPresenter(stateMachine, createStore, stateFormatter);
});

it('sets the initial state on the view', () => {
    subject.attach(view);

    expect(view.stateChanges).toEqual([
        stateFormatter(stateMachine.startState())
    ]);
});

it('dispatches actions to the store and informs the view of state changes', () => {
    let action = {type: actionTypes.PLAYER_HIT};
    subject.attach(view);
    subject.sendAction(action);

    let expectedStartState = stateMachine.startState();
    let expectedStateChange = stateMachine.reducer(expectedStartState, action);
    expect(view.stateChanges).toEqual([
        stateFormatter(expectedStartState),
        stateFormatter(expectedStateChange)
    ]);
    expect(subject.store.getState()).toEqual(expectedStateChange);
});

class ViewSpy implements View {
    stateChanges: Array<ViewGameState> = [];

    setState(state: ViewGameState): void {
        this.stateChanges.push(state);
    }
}