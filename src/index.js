import Phaser from 'phaser';

import {Barrier} from './barrier';


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


class MyGame extends Phaser.Scene {
    constructor() {
        super();
        this.maxSpeed = 800;
        this.width = 800;
        this.height = 600;
    }

    create() {
        this.player = this.add.circle(400, 300, 25, 0xff8800);
        this.physics.add.existing(this.player);
        this.player.body.velocity.x = 300;
        this.input.on("pointerdown", this.jump, this);
        this.cameras.main.startFollow(this.player, false, 1, 0);

        let bX = this.width;
        this.barriers = this.physics.add.staticGroup();
        for (let i = 0; i < 100; i++) {
            const holeY = randomIntFromInterval(150, this.cameras.main.height - 150);
            const b = Barrier.add(this, bX, holeY, this.height);
            bX += 400;
            this.barriers.add(b.topRect);
            this.barriers.add(b.bottomRect);
        }
        this.physics.add.collider(this.player, this.barriers, () => this.gameOver());
    }

    jump() {
        const curSpeed = this.player.body.velocity.y;
        this.player.body.velocity.y = Math.max(-this.maxSpeed, curSpeed - 500);
    }

    update() {
        if (this.player.y <= 0 || this.player.y > this.height) {
            this.gameOver();
        }
    }

    gameOver() {
        this.player.body.setEnable(false);
        this.cameras.main.fade(250);
        this.time.delayedCall(250, () => this.scene.restart());
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#5DACD8",
    scene: MyGame,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
        },
    },
};

const game = new Phaser.Game(config);
