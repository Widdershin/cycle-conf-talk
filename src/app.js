import {div, pre} from '@cycle/dom';
import {Observable} from 'rx';

function mario ({x, y, size}) {
  return (
    div('.mario', {
      style: {
        width: size + 'px',
        height: size + 'px',
        background: 'orange',
        position: 'absolute',
        left: x + 'px',
        top: y + 'px'
      }
    })
  );
}

function view (state) {
  return (
    div([
      pre(JSON.stringify(state, null, 2)),
      mario(state.mario)
    ])
  );
}

function update (delta) {
  return (state) => {
    state.mario.x += state.mario.hSpeed * delta;
    return state;
  };
}

export default function App ({DOM, Animation}) {
  const initialState = {
    mario: {
      x: 50,
      y: 50,
      size: 20,
      hSpeed: 0.15
    }
  };

  const update$ = Animation.map(({delta}) => update(delta));

  const state$ = update$.startWith(initialState)
    .scan((state, action) => action(state));

  return {
    DOM: state$.map(view)
  };
}
