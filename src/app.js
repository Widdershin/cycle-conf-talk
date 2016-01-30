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

function update (delta, dPressed, aPressed) {
  return (state) => {
    let moveDirection = 0;

    if (dPressed) {
      moveDirection += 1;
    }

    if (aPressed) {
      moveDirection -= 1;
    }

    state.mario.x += state.mario.hSpeed * moveDirection * delta;

    Object.assign(state, {
      dPressed,
      aPressed
    });

    return state;
  };
}

export default function App ({DOM, Animation, Keys}) {
  const initialState = {
    mario: {
      x: 50,
      y: 50,
      size: 20,
      hSpeed: 0.15
    }
  };

  const keys = {
    d$: Keys.isDown(68),
    a$: Keys.isDown(65)
  }

  const update$ = Animation.withLatestFrom(keys.d$, keys.a$, ({delta}, dPressed, aPressed) => update(delta, dPressed, aPressed));

  const state$ = update$.startWith(initialState)
    .scan((state, action) => action(state));

  return {
    DOM: state$.map(view)
  };
}
