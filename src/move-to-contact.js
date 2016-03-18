import collide from 'box-collide';

export default function moveToContact (movingEntity, entityToCollideWith, deltaTime) {
  let amountMoved = {
    h: 0,
    v: 0
  };

  function move () {
    if (Math.abs(amountMoved.h) >= Math.abs(movingEntity.hSpeed) &&
        Math.abs(amountMoved.v) >= Math.abs(movingEntity.vSpeed)) {
      return movingEntity;
    }

    const normalMax = Math.abs(movingEntity.hSpeed) + Math.abs(movingEntity.vSpeed);

    const normalHSpeed = movingEntity.hSpeed / normalMax;
    const normalVSpeed = movingEntity.vSpeed / normalMax;

    const nextPosition = Object.assign(
      {},
      movingEntity,
      {
        x: movingEntity.x + normalHSpeed,
        y: movingEntity.y + normalVSpeed
      }
    );

    if (collide(nextPosition, entityToCollideWith)) {
      return movingEntity;
    }

    movingEntity.x += normalHSpeed;
    movingEntity.y += normalVSpeed;

    amountMoved.h += normalHSpeed;
    amountMoved.v += normalVSpeed;

    return move();
  }

  return move();
}
