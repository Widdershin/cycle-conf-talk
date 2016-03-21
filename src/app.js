import {div, pre} from '@cycle/dom';
import {Observable} from 'rx';
import _ from 'lodash';
import collide from 'box-collide';
import moveToContact from './move-to-contact';

const text = [
  {
    text: 'Back to the Future',
    x: 50,
    y: 50,
    title: true
  },

  {
    text: 'Hot Reloading and Time Travel With Cycle.js',
    x: 50,
    y: 100
  }
];

function renderText ({text, x, y, title}, key) {
  const style = {
    position: 'absolute',
    left: x + 'px',
    top: y + 'px'
  };

  const innerHTML = text.replace('\n', '<br>');

  return (
    div(`.text ${title ? '.title' : ''}`, {key, style, innerHTML})
  );
}

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

function platform ({x, y, width, height}) {
  return (
    div('.ground', {
      style: {
        width: width + 'px',
        height: height + 'px',
        background: 'grey',
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

function view (state, width) {
  const player = _.find(state.gameObjects, {name: 'mario'})

  return (
    div('.slides', {key: 5434543, style: {transform: `translateX(-${player.x - width / 2}px)`}}, [
      ...state.gameObjects.map(obj => obj.view && obj.view(obj) || defaultView(obj)),
      div('.text', text.map(renderText))
    ])
  );
}

function update (delta, dPressed, aPressed, spacePressed) {
  return (state) => {
    const mario = state.gameObjects[0];

    const otherGameObjects = state.gameObjects.slice(1);

    const nextMarioPosition = Object.assign(
      {},
      mario,
      {
        x: mario.x + mario.hSpeed,
        y: mario.y + mario.vSpeed
      }
    );

    const collisions = otherGameObjects.filter(obj => collide(nextMarioPosition, obj));

    const marioOnGroundPosition = Object.assign(
      {},
      mario,
      {
        x: mario.x + mario.hSpeed,
        y: mario.y + (mario.vSpeed + state.gravity * delta)
      }
    );

    mario.onGround = otherGameObjects
      .filter(obj => collide(marioOnGroundPosition, obj))
      .some(obj => mario.y + mario.height < obj.y);

    const marioCollidingRightPosition = Object.assign(
      {},
      mario,
      {
        x: mario.x + mario.hSpeed + 1,
        y: mario.y + mario.vSpeed
      }
    );

    const collidingRight = otherGameObjects
      .filter(obj => collide(marioCollidingRightPosition, obj))
      .some(obj => (mario.x + mario.width) < obj.x);

    if (collidingRight) {
      mario.hSpeed = 0;
    }

    const marioCollidingLeftPosition = Object.assign(
      {},
      mario,
      {
        x: mario.x + mario.hSpeed - 1,
        y: mario.y + mario.vSpeed
      }
    );

    const collidingLeft = otherGameObjects
      .filter(obj => collide(marioCollidingLeftPosition, obj))
      .some(obj => obj.x + obj.width < mario.x);

    if (collidingLeft) {
      mario.hSpeed = 0;
    }

    if (collisions.length >= 1) {
      moveToContact(mario, collisions[0], delta);
    }

    if (!mario.onGround) {
      mario.vSpeed += state.gravity * delta;
    } else {
      mario.vSpeed = 0;
    }

    if (mario.onGround && spacePressed) {
      mario.vSpeed -= mario.jumpHeight;
    }

    let moveDirection = 0;

    if (dPressed && !collidingRight) {
      moveDirection += 1;
    }

    if (aPressed && !collidingLeft) {
      moveDirection -= 1;
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

export default function App ({DOM, Animation, Keys, Resize}) {
  const initialState = {
    gameObjects: [
      {
        name: 'mario',
        x: 300,
        y: 250,
        width: 20,
        height: 20,
        hAcceleration: 0.015,
        hSpeed: 0,
        vSpeed: 0,
        view: mario,
        jumpHeight: 4
      },

      {
        name: 'ground',
        x: 0,
        y: 500,
        width: 1900,
        height: 300,
        view: ground
      },

      {
        name: 'ground',
        x: 800,
        y: 400,
        width: 800,
        height: 500,
        view: ground
      }
    ],

    gravity: 0.008
  };

  const keys = {
    d$: Keys.isDown('D').startWith(false),
    a$: Keys.isDown('A').startWith(false),
    space$: Keys.isDown('Space').startWith(false)
  };

  const update$ = Animation.withLatestFrom(keys.d$, keys.a$, keys.space$, ({delta}, dPressed, aPressed, spacePressed) => update(delta, dPressed, aPressed, spacePressed));

  const state$ = update$.startWith(initialState)
    .scan((state, action) => action(state));

  const viewportWidth$ = Resize
    .pluck('width')
    .startWith(window.innerWidth);

  return {
    DOM: state$.withLatestFrom(viewportWidth$, view)
  };
}
