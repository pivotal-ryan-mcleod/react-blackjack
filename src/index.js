// @flow
import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {KnuthShuffler} from "./KnuthShuffler";
import {Blackjack} from "./Blackjack";
import {ReactiveAppPresenter} from "./ReactiveAppPresenter";
import type {AppDependencies} from "./App";

function appDependencies(): AppDependencies {
    return {appPresenter: new ReactiveAppPresenter(new Blackjack(new KnuthShuffler()))};
}

ReactDOM.render(<App {...appDependencies()} />, document.getElementById('root'));
registerServiceWorker();