import {Card} from "./Card";
import React, {Component} from 'react';

export interface HandProps {
    hand: Array<Card>;
}

export class HandComponent extends Component<HandProps, void> {
    render() {
        return <div className="card-hand">
            {this.props.hand.map(card => {
                if (card.faceUp) {
                    return <div className='card'><span className='card-label'>{card.toString()}</span></div>
                } else {
                    return <div className='card card-back'/>
                }
            })}
        </div>
    }
}