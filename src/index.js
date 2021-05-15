import Phaser from 'phaser';

import {Barrier} from './barrier';


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


class MyGame extends Phaser.Scene {
    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;

        this.speedMax = 800;
        this.speedBump = 500;
        this.speedX = 300;

        this.barrierShiftFromSide = 120;
        this.betweenBarriers = 400;
    }

    create() {
        const playerX = this.width * 1 / 3;
        // todo: collision box for circle is a rectangle for some reason, fix it
        this.player = this.add.circle(playerX, this.height / 2, 25, 0xff8800);
        this.physics.add.existing(this.player);
        this.player.body.velocity.x = this.speedX;
        this.input.on("pointerdown", this.jump, this);

        // camera follows players x coordinate, stay in the center of the screen
        const cameraShift = this.width / 2 - playerX;
        this.cameras.main.startFollow(this.player, false, 1, 0, -cameraShift, 0);

        // todo: add barriers dynamically
        let bX = this.width;
        this.barriers = this.physics.add.staticGroup();
        for (let i = 0; i < 100; i++) {
            const holeY = randomIntFromInterval(
                this.barrierShiftFromSide,
                this.height - this.barrierShiftFromSide,
            );
            const b = Barrier.add(this, bX, holeY, this.height);
            bX += this.betweenBarriers;
            this.barriers.add(b.topRect);
            this.barriers.add(b.bottomRect);
        }
        this.physics.add.collider(this.player, this.barriers, () => this.gameOver());
    }

    jump() {
        const curSpeed = this.player.body.velocity.y;
        this.player.body.velocity.y = Math.max(-this.speedMax, curSpeed - this.speedBump);
    }

    update() {
        if (this.player.y <= 0 || this.player.y > this.height) {
            this.gameOver();
        }
    }

    gameOver() {
        this.player.body.setEnable(false);
        this.cameras.main.fade(500);
        this.time.delayedCall(500, () => this.scene.restart());
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
            gravity: {
                y: 800,
            },
            debug: false,
        },
    },
};

const game = new Phaser.Game(config);
