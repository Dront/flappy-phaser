import Phaser from 'phaser';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    create () {
        let circle = this.add.circle(400, 300, 100, 0xff0088);
        this.tweens.add({
            targets: circle,
            scaleX: 0.5,
            scaleY: 0.5,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#5DACD8",
    scene: MyGame
};

const game = new Phaser.Game(config);
