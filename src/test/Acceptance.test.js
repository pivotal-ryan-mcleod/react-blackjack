/**
 * @jest-environment jsdom
 */

import {mount} from "enzyme";
import {appDependencies} from "../AppDependencies";
import {TestShuffler} from "./doubles/TestShuffler";
import {ALL_CARDS_SORTED, DEALER_BUST_SCENARIO, FAIR_GAME_SCENARIO} from "./fixtures/DeckFixtures";
import * as React from "react";
import App from "../App";

const stayButton = '[children="Stay"]';

function clickHit(app) {
    app.find('[children="Hit"]').simulate('click');
}

function clickStay(app) {
    app.find(stayButton).simulate('click');
}

it('player hits until bust', () => {
    let app = mount(<App {...appDependencies(new TestShuffler(ALL_CARDS_SORTED))}/>);

    clickHit(app);
    clickHit(app);
    clickHit(app);

    expect(app.text()).toContain("You: 22 - Bust!");
});

it('player loses with a lower point total', () => {
    let app = mount(<App {...appDependencies(new TestShuffler(ALL_CARDS_SORTED))}/>);

    clickStay(app);

    expect(app.text()).toContain("You: 14 - You lose!");
    expect(app.text()).toContain("Dealer: 17");
});

it('player stays and dealer busts', () => {
    let app = mount(<App {...appDependencies(new TestShuffler(DEALER_BUST_SCENARIO))}/>);

    clickStay(app);

    expect(app.text()).toContain("You: 14 - You win!");
    expect(app.text()).toContain("Dealer: 26 - Bust!");
});

it('player wins with a higher point total', () => {
    let app = mount(<App {...appDependencies(new TestShuffler(FAIR_GAME_SCENARIO))}/>);

    clickHit(app);
    clickStay(app);

    expect(app.text()).toContain("You: 21 - You win!");
    expect(app.text()).toContain("Dealer: 17");
});