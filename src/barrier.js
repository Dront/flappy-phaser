
export class Barrier {
    constructor(topRect, bottomRect) {
        this.topRect = topRect;
        this.bottomRect = bottomRect;
    }

    static add(scene, posX, holeY, screenHeight) {
        const topRectHeight = holeY - this.holeSize / 2;
        let topRect = scene.add.rectangle(posX, 0, this.width, topRectHeight, this.color);
        topRect.setOrigin(0, 0);

        const bottomRectY = holeY + this.holeSize / 2;
        const bottomRectHeight = screenHeight - bottomRectY;
        let bottomRect = scene.add.rectangle(posX, bottomRectY, this.width, bottomRectHeight, this.color);
        bottomRect.setOrigin(0, 0);

        return new Barrier(topRect, bottomRect);
    }
}

Barrier.width = 100;
Barrier.holeSize = 200;
Barrier.color = 0x00ff88;
