import {div, pre} from '@cycle/dom';
import {Observable} from 'rx';
import _ from 'lodash';

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

function ground ({x, y, width, height}) {
  return (
    div('.ground', {
      style: {
        width: width + 'px',
        height: height + 'px',
        background: 'brown',
        position: 'absolute',
        left: x + 'px',
        top: y + 'px'
      }
    })
  );
}

function defaultView(obj) {
  return (
    pre('.game-object', {
      style: {
        position: 'absolute',
        left: obj.x + 'px',
        top: obj.y + 'px'
      }
    }, JSON.stringify(obj, null, 2))
  );
}

function view (state) {
  return (
    div([
      pre(JSON.stringify(state, null, 2)),
      state.gameObjects.map(obj => obj.view && obj.view(obj) || defaultView(obj))
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

    const mario = state.gameObjects[0];

    mario.x += mario.hSpeed * moveDirection * delta;

    Object.assign(state, {
      dPressed,
      aPressed
    });

    return state;
  };
}

export default function App ({DOM, Animation, Keys}) {
  const initialState = {
    gameObjects: [
      {
        name: 'mario',
        x: 300,
        y: 50,
        size: 20,
        hSpeed: 0.15,
        view: mario
      },

      {
        name: 'ground',
        x: 0,
        y: 500,
        width: 800,
        height: 60,
        view: ground
      }
    ]
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
