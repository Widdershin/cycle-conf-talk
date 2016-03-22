import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeAnimationDriver} from 'cycle-animation-driver';
import {restart, restartable} from 'cycle-restart';
import isolate from '@cycle/isolate';
import {Observable, ReplaySubject} from 'rx';
import keycode from 'keycode';

var app = require('./src/app').default;

function makeKeysDriver () {
  const keydown$ = Observable.fromEvent(document, 'keydown');
  const keyup$ = Observable.fromEvent(document, 'keyup');

  function isKey (key) {
    if (typeof key !== 'number') {
      key = keycode(key);
    }

    return (event) => {
      return event.keyCode === key;
    };
  }

  return function keysDriver () {
    return {
      isDown: (key) => {
        return Observable.merge(
          keydown$.filter(isKey(key)).map(_ => true),
          keyup$.filter(isKey(key)).map(_ => false)
        ).startWith(false).distinctUntilChanged();
      }
    };
  };
}

function makeResizeDriver () {
  return function resizeDriver () {
    const subject = new ReplaySubject(1);

    window.addEventListener(
      'resize',
      () => subject.onNext(
        {
          width: window.innerWidth,
          height: window.innerHeight
        }
      )
    );

    return subject;
  };
}

const drivers = {
  DOM: restartable(makeDOMDriver('.app'), {replayOnlyLastSink: true}),
  Animation: restartable(makeAnimationDriver()),
  Keys : restartable(makeKeysDriver()),
  Resize: restartable(makeResizeDriver())
};

const {sinks, sources} = run(app, drivers);

if (module.hot) {
  module.hot.accept('./src/app', () => {
    app = require('./src/app').default;

    restart(app, drivers, {sinks, sources}, {isolate, run});
  });
}
