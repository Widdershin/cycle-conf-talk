/* globals describe, xit */

import assert from 'assert';
import moveToContact from '../src/move-to-contact';

describe('moveToContact', () => {
  it('moves one entity to collide with another', () => {
    const mario = {
      x: 0,
      y: 0,
      width: 32,
      height: 32,
      hSpeed: 5,
      vSpeed: 0
    };

    const wall = {
      x: 35,
      y: 0,
      width: 20,
      height: 20,
      hSpeed: 0,
      vSpeed: 0
    };

    const deltaTime = 1;

    const movedMario = moveToContact(mario, wall, deltaTime);

    assert.equal(movedMario.x, 2);
  });

  it('handles vertical collisions', () => {
    const mario = {
      x: 0,
      y: 0,
      width: 32,
      height: 32,
      hSpeed: 0,
      vSpeed: 10
    };

    const wall = {
      x: 0,
      y: 37,
      width: 20,
      height: 20,
      hSpeed: 0,
      vSpeed: 0
    };

    const deltaTime = 1;

    const movedMario = moveToContact(mario, wall, deltaTime);

    assert.equal(movedMario.y, 4);
  });

  it("doesn't explode if contact will never be made", () => {
    const mario = {
      x: 0,
      y: 0,
      width: 32,
      height: 32,
      hSpeed: 0,
      vSpeed: 10
    };

    const wall = {
      x: 37,
      y: 37,
      width: 20,
      height: 20,
      hSpeed: 0,
      vSpeed: 0
    };

    const deltaTime = 1;

    const movedMario = moveToContact(mario, wall, deltaTime);

    assert.equal(movedMario.y, 10);
  });

  it("doesn't explode if contact will never be made (moving left)", () => {
    const mario = {
      x: 0,
      y: 0,
      width: 32,
      height: 32,
      hSpeed: -5,
      vSpeed: 0
    };

    const wall = {
      x: 37,
      y: 37,
      width: 20,
      height: 20,
      hSpeed: 0,
      vSpeed: 0
    };

    const deltaTime = 1;

    const movedMario = moveToContact(mario, wall, deltaTime);

    assert.equal(movedMario.x, -5);
  });

  it("works correctly moving down and to the left", () => {
    const mario = {
      x: 0,
      y: 0,
      width: 32,
      height: 32,
      hSpeed: -5,
      vSpeed: 5
    };

    const wall = {
      x: -20,
      y: 35,
      width: 50,
      height: 20,
      hSpeed: 0,
      vSpeed: 0
    };

    const deltaTime = 1;

    const movedMario = moveToContact(mario, wall, deltaTime);

    assert.equal(movedMario.x, -2.5, 'x');
    assert.equal(movedMario.y, 2.5, 'y');
  });
});
