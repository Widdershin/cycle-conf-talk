import uuid from 'node-uuid';
import {div} from '@cycle/dom';

function view ({id, x, y, width, height}) {
  return (
    div('.ground', {
      key: id,
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

export default function Ground ({x, y, width, height}) {
  return {
    id: uuid.v4(),
    name: 'ground',
    x,
    y,
    width,
    height,
    view
  };
}
