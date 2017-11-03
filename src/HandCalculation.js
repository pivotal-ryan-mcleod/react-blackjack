// @flow

import {Card} from "./Card";

export function calculateHandTotal(cards: Array<Card>): number {
    let pessimisticCalculation = cards.reduce((total, card) => {
        switch (card.value) {
            case 'A':
                return total + 11;
            case 'J':
            case 'Q':
            case 'K':
                return total + 10;
            default:
                return total + parseInt(card.value, 10);
        }
    }, 0);

    return cards
        .filter(c => c.value === 'A')
        .reduce((total) => {
            if (total > 21) {
                return total - 10; // count ace as 1
            } else {
                return total;
            }
        }, pessimisticCalculation);
}