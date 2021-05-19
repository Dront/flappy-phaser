import Phaser from 'phaser';

import { Barrier } from './barrier';


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;

        this.speedMax = 800;
        this.speedBump = 500;
        this.speedX = this.width * 0.5;
        this.gravity = 900;

        this.barrierShiftFromSide = 120;
        this.betweenBarriers = this.width * 0.5;
    }

    create() {
        const playerX = this.width * 1 / 3;
        const playerSize = 25;
        this.player = this.add.circle(playerX, this.height / 2, playerSize, 0xff8800);
        this.physics.add.existing(this.player);
        this.player.body.setCircle(playerSize);
        this.player.body.velocity.x = this.speedX;
        this.player.body.setGravity(0, this.gravity);
        this.input.on("pointerdown", this.jump, this);

        // camera follows players x coordinate, stays in the center of the screen
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

        this.input.keyboard.on('keydown-ESC', this.pauseGame, this);

        this.scoreText = this.add.text(this.width * 0.1, this.height * 0.1, this.getScoreText());
        // stick to camera
        this.scoreText.setScrollFactor(0, 0);

        // todo: save records?
    }

    getScoreText() {
        const score = Math.floor(this.player.x);
        return score.toString();
    }

    jump() {
        const curSpeed = this.player.body.velocity.y;
        this.player.body.velocity.y = Math.max(-this.speedMax, curSpeed - this.speedBump);
    }

    update() {
        if (this.player.y <= 0 || this.player.y > this.height) {
            this.gameOver();
        }
        this.scoreText.setText(this.getScoreText());
    }

    gameOver() {
        this.player.body.setEnable(false);
        this.cameras.main.fade(500);
        this.time.delayedCall(500, () => this.scene.restart());
    }

    pauseGame() {
        this.scene.pause();
        this.scene.launch('PauseOverlayScene');
    }
}
