/**
 * @jest-environment jsdom
 */

import App from "../App.js";
import React from "react";
import type {ViewGameState} from "../StateFormatter";
import type {GameAction} from "../BlackjackStateMachine";
import {Card} from "../Card";
import {mount} from "enzyme";
import {winnerValues} from "../BlackjackStateMachine";
import {BehaviorSubject, TestScheduler, VirtualTimeScheduler} from "rxjs";
import {ReplaySubject} from "rxjs";
import type {AppPresenter} from "../App";
import type {View} from "../App";

let wrapper;
let defaultState: ViewGameState;
let scheduler: VirtualTimeScheduler;
let appPresenterSpy: AppPresenterSpy;

beforeEach(() => {
    defaultState = {
        player: {
            total: 'PLAYER_TOTAL',
            hand: [
                new Card('♦', 'A', true),
                new Card('♦', '3', false)
            ],
        },
        dealer: {
            total: 'DEALER_TOTAL',
            hand: [
                new Card('♦', '2', true),
                new Card('♦', '4', false)
            ]
        },
        winner: winnerValues.NONE,
        playerDone: false,
        dealerAction: false
    };
    scheduler = new VirtualTimeScheduler();

    appPresenterSpy = new AppPresenterSpy();
    wrapper = mount(<App appPresenter={appPresenterSpy}/>);
    wrapper.setState(defaultState);
});

it('shows the player total', () => {
    expect(wrapper.text()).toContain("You: PLAYER_TOTAL");
});

it('shows the dealer total', () => {
    expect(wrapper.text()).toContain("Dealer: DEALER_TOTAL");
});

it('shows the face up cards', () => {
    expect(wrapper.text()).toContain("A♦");
    expect(wrapper.text()).toContain("2♦");
});

it('shows only card backs for the face down cards', () => {
    expect(wrapper.text()).not.toContain("3♦");
    expect(wrapper.text()).not.toContain("4♦");
    expect(wrapper.find('.card-back')).toHaveLength(2);
});

it('shows when the player wins', () => {
    wrapper.setState({
        ...defaultState,
        winner: winnerValues.PLAYER
    });

    expect(wrapper.text()).toContain("You: PLAYER_TOTAL - You win!");
});

it('shows when the dealer wins', () => {
    wrapper.setState({
        ...defaultState,
        winner: winnerValues.DEALER
    });

    expect(wrapper.text()).toContain("You: PLAYER_TOTAL - You lose!");
});

it('shows when the game is a draw', () => {
    wrapper.setState({
        ...defaultState,
        winner: winnerValues.DRAW
    });

    expect(wrapper.text()).toContain("You: PLAYER_TOTAL - Draw");
});

it('shows when the player busts', () => {
    wrapper.setState({
        ...defaultState,
        winner: winnerValues.DEALER,
        player: {
            ...defaultState.player,
            bust: true
        }
    });

    expect(wrapper.text()).toContain("You: PLAYER_TOTAL - Bust!");
});

it('shows when the dealer busts', () => {
    wrapper.setState({
        ...defaultState,
        winner: winnerValues.PLAYER,
        dealer: {
            ...defaultState.dealer,
            bust: true
        }
    });

    expect(wrapper.text()).toContain("Dealer: DEALER_TOTAL - Bust!");
});

it('sends an action when hit is clicked', () => {
    wrapper.find('button[children="Hit"]').simulate('click');

    expect(appPresenterSpy.receivedActions).toEqual([{type: 'PLAYER_HIT'}]);
});

it('sends an action when stay is clicked', () => {
    wrapper.find('button[children="Stay"]').simulate('click');

    expect(appPresenterSpy.receivedActions).toEqual([{type: 'PLAYER_STAY'}]);
});

it('disables the hit/stay buttons if the player is done their turn', () => {
    wrapper.setState({
        ...defaultState,
        playerDone: true
    });

    wrapper.find('button[children="Hit"]').simulate('click');
    wrapper.find('button[children="Stay"]').simulate('click');

    expect(appPresenterSpy.receivedActions).toEqual([]);
});

class AppPresenterSpy implements AppPresenter {
    mountedView: View;
    receivedActions: Array<GameAction> = [];

    attach(view: View): void {
        this.mountedView = view;
    }

    sendAction(action: GameAction): void {
        this.receivedActions.push(action);
    }
}