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

    preload() {
        // default macos 'tput bel' sound
        this.load.audio('game-over-sound', ['assets/Funk.wav']);
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;

        this.speedBump = 500;
        this.speedX = this.width * 0.5;
        this.gravityX = 5;
        this.gravityY = 1000;

        this.barrierShiftFromSide = 120;
        this.betweenBarriers = 400;

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

        this.barriersList = [];
        this.barriersGroup = this.physics.add.staticGroup();
        this.updateBarriers();
        this.physics.add.collider(this.player, this.barriersGroup, () => this.gameOver());

        this.gameOverSound = this.sound.add("game-over-sound");
        this.input.keyboard.on('keydown-ESC', this.pauseGame, this);

        // todo: add styling and make it more visible on the background and barriers
        // todo: highlight score if this is a new highscore
        this.scoreText = this.add.text(this.width * 0.05, this.height * 0.05, this.getScoreText());
        // stick to camera
        this.scoreText.setScrollFactor(0, 0);

        this.tryCountText = this.add.text(this.width * 0.9, this.height * 0.05, this.getTryCountText());
        this.tryCountText.setScrollFactor(0, 0);
    }

    pushBarrier(x) {
        const holeY = randomIntFromInterval(
            this.barrierShiftFromSide,
            this.height - this.barrierShiftFromSide,
        );
        const barrier = Barrier.add(this, x, holeY, this.height);
        this.barriersGroup.add(barrier.topRect);
        this.barriersGroup.add(barrier.bottomRect);
        this.barriersList.push(barrier);
        return barrier;
    }

    popLeftBarrier() {
        const barrier = this.barriersList.shift();
        this.barriersGroup.remove(barrier.topRect, true, true);
        this.barriersGroup.remove(barrier.bottomRect, true, true);
    }

    // Cleans up barriers to the left of player - width, adds barriers up to player + width.
    // We should probably use linked-list-like structure for barriers, but meh.
    updateBarriers() {
        const minX = this.player.x - this.width;
        while (this.barriersList.length > 0 && this.barriersList[0].x < minX) {
            this.popLeftBarrier()
        }

        if (this.barriersList.length === 0) {
            this.pushBarrier(this.player.x + this.betweenBarriers);
        }

        const maxX = this.player.x + this.width;
        let lastBarrier = this.barriersList[this.barriersList.length - 1];
        while (lastBarrier.x < maxX) {
            lastBarrier = this.pushBarrier(lastBarrier.x + this.betweenBarriers);
        }
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
        this.player.body.velocity.y -= this.speedBump;
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

        this.updateBarriers();
    }

    gameOver() {
        // This function is called on collision before rendering the collision itself.
        // If we disable player immidiately it'll look like the player has not touched the barrier,
        // so small delay is used here to disable player just after rendering the next frame.
        this.time.delayedCall(1, () => this.player.body.setEnable(false));
        const fadeTime = 500;  // ms
        this.cameras.main.fade(fadeTime);
        this.time.delayedCall(fadeTime, () => this.scene.restart());
        stats.incTryCount();
        this.gameOverSound.play();
    }

    pauseGame() {
        this.scene.pause();
        this.scene.launch('PauseOverlayScene');
    }
}
