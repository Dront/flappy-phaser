import Phaser from 'phaser';

import { Barrier } from './barrier';
import * as stats from './stats';


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
        this.gravityX = 5;
        this.gravityY = 1000;

        this.barrierShiftFromSide = 120;
        this.betweenBarriers = this.width * 0.5;

        this.previousHighscore = stats.getHighscore();
    }

    create() {
        const playerX = this.width * 1 / 3;
        const playerSize = 25;
        this.player = this.add.circle(playerX, this.height / 2, playerSize, 0xff8800);
        this.physics.add.existing(this.player);
        this.player.body.setCircle(playerSize);
        this.player.body.velocity.x = this.speedX;
        // slowly increase horizontal speed
        this.player.body.setGravity(this.gravityX, this.gravityY);
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

        // todo: add styling and make it more visible on the background and barriers
        // todo: highlight score if this is a new highscore
        this.scoreText = this.add.text(this.width * 0.05, this.height * 0.05, this.getScoreText());
        // stick to camera
        this.scoreText.setScrollFactor(0, 0);

        this.tryCountText = this.add.text(this.width * 0.9, this.height * 0.05, this.getTryCountText());
        this.tryCountText.setScrollFactor(0, 0);
    }

    getScore() {
        return Math.floor(this.player.x);
    }

    getScoreText() {
        return `${this.getScore()} (${this.previousHighscore})`;
    }

    getTryCountText() {
        return '#' + stats.getTryCount().toString();
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
        const score = this.getScore();
        if (score > stats.getHighscore()) {
            stats.setHighscore(score);
        }
    }

    gameOver() {
        this.player.body.setEnable(false);
        const fadeTime = 500;  // ms
        this.cameras.main.fade(fadeTime);
        this.time.delayedCall(fadeTime, () => this.scene.restart());
        stats.incTryCount();
    }

    pauseGame() {
        this.scene.pause();
        this.scene.launch('PauseOverlayScene');
    }
}
