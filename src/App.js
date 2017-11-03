// @flow
import React, {Component} from 'react';
import './App.css';
import type {GameAction} from "./BlackjackStateMachine";
import {actionTypes, winnerValues} from "./BlackjackStateMachine";
import type {ViewGameState} from "./StateFormatter";
import {HandComponent} from "./HandComponent";

export interface AppDependencies {
    appPresenter: AppPresenter;
}

export interface View {
    setState(state: ViewGameState): void;
}

export interface AppPresenter {
    attach(view: View): void;
    sendAction(action: GameAction): void;
}

class App extends Component<AppDependencies, ViewGameState> {
    componentWillMount() {
        this.props.appPresenter.attach(this);
    }

    dispatchAction(action: GameAction) {
        this.props.appPresenter.sendAction(action);
    }

    render() {
        if (this.state) {
            return (
                <div className="App">
                    <h3>{`You: ${playerText(this.state)}`}</h3>
                    <HandComponent hand={this.state.player.hand}/>

                    <button onClick={() => this.dispatchAction({type: actionTypes.PLAYER_HIT})}
                            disabled={this.state.playerDone}>
                        Hit
                    </button>
                    <button onClick={() => this.dispatchAction({type: actionTypes.PLAYER_STAY})}
                            disabled={this.state.playerDone}>
                        Stay
                    </button>

                    <h3>{`Dealer: ${dealerText(this.state)}`}</h3>
                    <HandComponent hand={this.state.dealer.hand}/>
                </div>
            );
        } else {
            return <div className="App" />
        }
    }
}

function playerText(state: ViewGameState): string {
    let playerText = state.player.total;
    if (state.player.bust) {
        playerText += " - Bust!"
    } else if (state.winner === winnerValues.PLAYER) {
        playerText += " - You win!";
    } else if (state.winner === winnerValues.DEALER) {
        playerText += " - You lose!";
    } else if (state.winner === winnerValues.DRAW) {
        playerText += " - Draw"
    }
    return playerText;
}

function dealerText(state: ViewGameState): string {
    let dealerText = state.dealer.total;
    if (state.dealer.bust) {
        dealerText += " - Bust!"
    }
    return dealerText;
}

export default App;
