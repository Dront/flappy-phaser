import config from './config';


export class Barrier {
    constructor(topRect, bottomRect, x) {
        this.topRect = topRect;
        this.bottomRect = bottomRect;
        this.x = x;
    }

    static add(scene, posX, holeY, screenHeight, color) {
        const topRectHeight = holeY - config.barriers.holeSize / 2;
        let topRect = scene.add.rectangle(posX, 0, config.barriers.width, topRectHeight, color);
        topRect.setOrigin(0, 0);
        topRect.setStrokeStyle(config.barriers.borderWidth, config.barriers.borderColor);

        const bottomRectY = holeY + config.barriers.holeSize / 2;
        const bottomRectHeight = screenHeight - bottomRectY;
        let bottomRect = scene.add.rectangle(posX, bottomRectY, config.barriers.width, bottomRectHeight, color);
        bottomRect.setOrigin(0, 0);
        bottomRect.setStrokeStyle(config.barriers.borderWidth, config.barriers.borderColor);

        return new Barrier(topRect, bottomRect, posX);
    }
}
