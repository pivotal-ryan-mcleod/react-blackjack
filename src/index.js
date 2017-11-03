// @flow
import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {appDependencies} from "./AppDependencies";

ReactDOM.render(<App {...appDependencies()} />, document.getElementById('root'));
registerServiceWorker();