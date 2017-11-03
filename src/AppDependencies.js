// @flow
import type {AppDependencies} from "./App";
import {KnuthShuffler} from "./KnuthShuffler";
import {BlackjackStateMachine} from "./BlackjackStateMachine";
import {ReduxAppPresenter} from "./ReduxAppPresenter";
import {createStore} from "redux";
import {epics} from "./Epics";
import {stateFormatter} from "./StateFormatter";
import type {Shuffler} from "./BlackjackStateMachine";

export function appDependencies(shuffler: Shuffler = new KnuthShuffler()): AppDependencies {
    const storeCreator = (reducer, initialState): any => {
        return createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    };
    return {
        appPresenter: new ReduxAppPresenter(
            new BlackjackStateMachine(shuffler),
            storeCreator,
            epics,
            stateFormatter
        )
    };
}