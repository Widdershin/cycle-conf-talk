import uuid from 'node-uuid';
import Ground from '../gameObjects/ground';
import {div, button, pre} from '@cycle/dom';
import Scratchpad from 'tricycle';
import {Observable} from 'rx';
import _ from 'lodash';

export default function slide01 ({DOM}) {
  scratchpad = Scratchpad(DOM);

  return {
    gameObjects: [
      Ground({
        x: 0,
        y: 500,
        width: 1500,
        height: 300
      }),
      {
        id: uuid.v4(),
        name: 'counter',
        x: 200,
        y: 0,
        count: 0,
        clicks: [],
        view (counter) {
          const style = {
            position: 'absolute',
            transform: `translate(${counter.x}px, ${counter.y}px)`,
            background: '#EEE',
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            width: '500px',
            padding: '5px'
          };

          return (
            div('.counter', {key: counter.id, style}, [
              scratchpad.DOM
            ])
          );
        }
      }
    ]
  };
}
