// @flow

import {Card} from "./Card";
import type {Shuffler} from "./Blackjack";
import {Deck} from "./Deck";
import {calculateHandTotal} from "./HandCalculation";
import {Observable} from "rxjs";
import * as Dealer from './Dealer'

export interface Person {
    hand: Array<Card>;
}

export interface GameState {
    player: Person;
    dealer: Person;
    deck: Deck;
    winner: ?GameWinner;
    playerDone: boolean;
    dealerAction: boolean;
}

export const actionTypes = {
    PLAYER_HIT: 'PLAYER_HIT',
    PLAYER_STAY: 'PLAYER_STAY',
    DEALER_HIT: 'DEALER_HIT',
    DEALER_STAY: 'DEALER_STAY',
};
type ActionType = $Keys<typeof actionTypes>;

export const winnerValues = {
    PLAYER: 'PLAYER',
    DEALER: 'DEALER',
    DRAW: 'DRAW',
    NONE: 'NONE'
};
export type GameWinner = $Keys<typeof winnerValues>;

export interface GameAction {
    type: ActionType;
}

export class BlackjackStateMachine {
    shuffler: Shuffler;

    constructor(shuffler: Shuffler) {
        this.shuffler = shuffler;
    }

    startState(): GameState {
        return initialState(this.shuffler);
    }

    reducers(state: GameState, action: GameAction): GameState {
        switch (action.type) {
            case actionTypes.PLAYER_HIT:
                return playerHit(state);
            case actionTypes.PLAYER_STAY:
                return playerStay(state);
            case actionTypes.DEALER_HIT:
                return dealerHit(state);
            case actionTypes.DEALER_STAY:
                return dealerStay(state);
            default:
                return state;
        }
    };
}

function initialState(shuffler: Shuffler): GameState {
    const deck = shuffler.shuffle(new Deck());
    const drawResult = deck.draw(4);

    let state = {
        deck: drawResult.deck,
        player: personFromHand([drawResult.cards[0], drawResult.cards[2]]),
        dealer: personFromHand([drawResult.cards[1], drawResult.cards[3].withFaceUp(false)]),
        winner: winnerValues.NONE,
        playerDone: false,
        dealerAction: false
    };

    let playerHasBlackjack = isBlackjack(state.player.hand);
    let dealerHasBlackjack = isBlackjack(state.dealer.hand);
    if (playerHasBlackjack && dealerHasBlackjack) {
        state.winner = winnerValues.DRAW;
    } else if (playerHasBlackjack) {
        state.winner = winnerValues.PLAYER;
    } else if (dealerHasBlackjack) {
        state.winner = winnerValues.DEALER;
    }
    if (playerHasBlackjack || dealerHasBlackjack) {
        state.playerDone = true;
        state.dealer = personWithHandRevealed(state.dealer);
    }
    return state;
}

function playerHit(state: GameState): GameState {
    let drawResult = state.deck.draw(1);
    let newHand = state.player.hand.concat(drawResult.cards);
    let newState = {
        ...state,
        deck: drawResult.deck,
        player: personFromHand(newHand)
    };
    if (calculateHandTotal(newHand) > 21) {
        newState.dealer = personWithHandRevealed(state.dealer);
        newState.winner = winnerValues.DEALER;
        newState.playerDone = true;
    }
    return newState;
}

function playerStay(state: GameState): GameState {
    return {
        ...state,
        dealer: personWithHandRevealed(state.dealer),
        playerDone: true
    }
}

function dealerHit(state: GameState): GameState {
    let drawResult = state.deck.draw(1);
    let newHand = state.dealer.hand.concat(drawResult.cards);
    let newState = {
        ...state,
        deck: drawResult.deck,
        dealer: personFromHand(newHand),
        dealerAction: true
    };
    if (calculateHandTotal(newHand) > 21) {
        newState.winner = winnerValues.PLAYER;
    }
    return newState;
}

function dealerStay(state: GameState): GameState {
    let winner: string = "";
    const playerScore = calculateHandTotal(state.player.hand);
    const dealerScore = calculateHandTotal(state.dealer.hand)
    if (dealerScore > playerScore) {
        winner = winnerValues.DEALER;
    } else if (dealerScore < playerScore) {
        winner = winnerValues.PLAYER;
    } else {
        winner = winnerValues.DRAW;
    }
    return {
        ...state,
        winner: winner,
        dealerAction: true
    }
}

function personWithHandRevealed(person: Person) {
    return personFromHand(person.hand.map(card => card.withFaceUp(true)))
}

function personFromHand(hand: Array<Card>): Person {
    return {
        hand: hand
    };
}

function isBlackjack(hand: Array<Card>): boolean {
    return hand.length === 2 && calculateHandTotal(hand) === 21;
}