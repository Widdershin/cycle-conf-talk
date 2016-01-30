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

export default function App ({DOM, Animation}) {
  const state$ = Observable.just({
    mario: {
      x: 50,
      y: 50,
      size: 20
    }
  });

  return {
    DOM: state$.map(view)
  };
}
