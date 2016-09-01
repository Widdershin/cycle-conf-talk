
import uuid from 'node-uuid';
import Ground from '../gameObjects/ground';
import {div, button, pre} from '@cycle/dom';

export default {
  gameObjects: [
    Ground({
      x: 0,
      y: 500,
      width: 1500,
      height: 400
    }),
    {
      id: uuid.v4(),
      name: 'counter',
      x: 250,
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
            pre('.explanation', {innerHTML: `f({<br>  add$: [${counter.clicks.join(', ')}]<br>})`}),
            div('', `=>`),
            div('.count', `Count: ${counter.count * 2}`),
            div('.buttons', [
              button('.add', `Add`),
              button('.reset', `Reset`)
            ])
          ])
        );
      }
    }
  ]
}
