// @flow
import type {AppDependencies} from "./App";
import {KnuthShuffler} from "./KnuthShuffler";
import {BlackjackStateMachine} from "./BlackjackStateMachine";
import {ReduxAppPresenter} from "./ReduxAppPresenter";
import {applyMiddleware, compose, createStore} from "redux";
import {stateFormatter} from "./StateFormatter";
import type {Shuffler} from "./BlackjackStateMachine";
import {rootEpic} from "./Epics";
import { createEpicMiddleware } from 'redux-observable';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware(rootEpic);

export function appDependencies(shuffler: Shuffler = new KnuthShuffler()): AppDependencies {
    const storeCreator = (reducer, initialState): any => {
        return createStore(reducer,
            initialState,
            composeEnhancers(
            applyMiddleware(epicMiddleware)
        ));
    };
    return {
        appPresenter: new ReduxAppPresenter(
            new BlackjackStateMachine(shuffler),
            storeCreator,
            stateFormatter
        )
    };
}