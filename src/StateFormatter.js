import {Card} from "./Card";
import {calculateHandTotal} from "./HandCalculation";
import type {GameState, GameWinner, Person} from "./BlackjackStateMachine";
import type {StateFormatter} from "./ReduxAppPresenter";

export interface ViewPerson {
    total: string;
    hand: Array<Card>;
    bust: boolean;
}

export interface ViewGameState {
    player: ViewPerson;
    dealer: ViewPerson;
    winner: GameWinner;
    dealerAction: boolean;
    playerDone: boolean;
}

export const stateFormatter: StateFormatter = state => {
    return {
        winner: state.winner,
        player: new ViewPersonImpl(state.player),
        dealer: new ViewPersonImpl(state.dealer),
        playerDone: state.playerDone,
        dealerAction: state.dealerAction
    };
};

class ViewPersonImpl implements ViewPerson {
    total: string;
    hand: Array<Card>;
    bust: boolean;

    constructor(person: Person) {
        this.hand = person.hand;
        this.total = handTotalDisplayString(person.hand);
        this.bust = bust(person.hand);
    }
}

function handTotalDisplayString(hand: Array<Card>): string {
    if (hand.some(card => !card.faceUp)) {
        return "";
    } else {
        return calculateHandTotal(hand).toString();
    }
}

function bust(hand: Array<Card>): boolean {
    return calculateHandTotal(hand) > 21;
}