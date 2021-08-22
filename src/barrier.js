import config from './config';


export class Barrier {
    constructor(topRect, bottomRect, x) {
        this.topRect = topRect;
        this.bottomRect = bottomRect;
        this.x = x;
    }

    static add(scene, posX, holeY, screenHeight, color) {
        const topRectHeight = holeY - this.holeSize / 2;
        let topRect = scene.add.rectangle(posX, 0, this.width, topRectHeight, color);
        topRect.setOrigin(0, 0);

        const bottomRectY = holeY + this.holeSize / 2;
        const bottomRectHeight = screenHeight - bottomRectY;
        let bottomRect = scene.add.rectangle(posX, bottomRectY, this.width, bottomRectHeight, color);
        bottomRect.setOrigin(0, 0);

        return new Barrier(topRect, bottomRect, posX);
    }
}

Barrier.width = config.barriers.width;
Barrier.holeSize = config.barriers.holeSize;
