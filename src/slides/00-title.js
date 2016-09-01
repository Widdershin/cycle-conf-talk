import uuid from 'node-uuid';
import Ground from '../gameObjects/ground';

export default function slide00 () {
  return {
    text: [
      {
        text: 'Back to the Future',
        x: 50,
        y: 20,
        title: true
      },

      {
        text: 'Hot Reloading and Time Travel With Cycle.js',
        x: 50,
        y: 100
      }
    ],

    gameObjects: [
      Ground({
        x: 0,
        y: 500,
        width: 1500,
        height: 300
      }),

      Ground({
        x: 0,
        y: 200,
        width: 50,
        height: 300
      })
    ]
  }
};
