import {Card, suits} from "../Card";
import {calculateHandTotal} from "../HandCalculation";
import * as _ from "lodash";

it('counts numbers by their numeric value', () => {
    expect(calculateHandTotal(cards(['2', '5', '7']))).toEqual(14);
});

it('counts aces as 11 if it would make the total less than 21', () => {
    expect(calculateHandTotal(cards(['2', 'A']))).toEqual(13);
});

it('counts aces as 1 if adding 11 would make the total more than 21', () => {
    expect(calculateHandTotal(cards(['10', '5', 'A']))).toEqual(16);
    expect(calculateHandTotal(cards(['A', '3', '5', '6']))).toEqual(15);
});

it('counts some aces as 1s and some aces as 11s if total is still less than 21', () => {
    expect(calculateHandTotal(cards(['A', 'A', '5']))).toEqual(17);
});

it('counts J/Q/K as 10', () => {
    expect(calculateHandTotal(cards(['J']))).toEqual(10);
    expect(calculateHandTotal(cards(['Q']))).toEqual(10);
    expect(calculateHandTotal(cards(['K']))).toEqual(10);
});

function cards(values) {
    return _.map(values, (v) => {
        return new Card(suits.SPADES, v)
    });
}