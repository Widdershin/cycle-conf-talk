import {div, pre} from '@cycle/dom';
import {Observable} from 'rx';
import _ from 'lodash';
import collide from 'box-collide';

function mario ({x, y, width, height}) {
  return (
    div('.mario', {
      style: {
        width: width + 'px',
        height: height + 'px',
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

function update (delta, dPressed, aPressed, spacePressed) {
  return (state) => {
    let moveDirection = 0;

    if (dPressed) {
      moveDirection += 1;
    }

    if (aPressed) {
      moveDirection -= 1;
    }

    const mario = state.gameObjects[0];

    mario.onGround = collide(mario, state.gameObjects[1]);

    if (!mario.onGround) {
      mario.vSpeed += state.gravity * delta;
    } else {
      mario.vSpeed = 0;
    }

    if (mario.onGround && spacePressed) {
      mario.vSpeed -= 4;
    }

    mario.hSpeed += mario.hAcceleration * moveDirection * delta;
    mario.x += mario.hSpeed;
    mario.y += mario.vSpeed;

    mario.hSpeed *= 0.94;

    Object.assign(state, {
      dPressed,
      aPressed,
      spacePressed
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
        width: 20,
        height: 20,
        hAcceleration: 0.015,
        hSpeed: 0,
        vSpeed: 0,
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
    ],

    gravity: 0.008
  };

  const keys = {
    d$: Keys.isDown(68),
    a$: Keys.isDown(65),
    space$: Keys.isDown(32)
  };

  const update$ = Animation.withLatestFrom(keys.d$, keys.a$, keys.space$, ({delta}, dPressed, aPressed, spacePressed) => update(delta, dPressed, aPressed, spacePressed));

  const state$ = update$.startWith(initialState)
    .scan((state, action) => action(state));

  return {
    DOM: state$.map(view)
  };
}
