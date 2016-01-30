import {div} from '@cycle/dom';
import {Observable} from 'rx';

export default function App ({DOM, Animation}) {
  return {
    DOM: Observable.just(div('.hello-world', 'Hello world'))
  };
}
