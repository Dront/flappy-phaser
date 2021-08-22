import Phaser from 'phaser';
import * as seedrandom from 'seedrandom';

import { Barrier } from './barrier';
import * as stats from './stats';
import config from './config';


// Returns the same (repeatable) random sequence of barriers for provided seed
class BarrierGenerator {
    constructor(shiftFromSide, screenHeight, seed) {
        this.shiftFromSide = shiftFromSide;
        this.screenHeight = screenHeight;
        console.log(`rng seed is ${seed}`);
        this.rng = new seedrandom(seed);
    }

    randomIntFromInterval(min, max) { // min and max included
        return Math.floor(this.rng() * (max - min + 1) + min);
    }

    randomFloat() {
        return this.rng();
    }

    generate(scene, x) {
        const holeY = this.randomIntFromInterval(
            this.shiftFromSide,
            this.screenHeight - this.shiftFromSide,
        );
        const color = Phaser.Display.Color.HSVToRGB(this.randomFloat(), 1, 0.8).color
        return Barrier.add(scene, x, holeY, this.screenHeight, color);
    }
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
    }

    create() {
        this.createPlayer();
        this.createBarriers();
        this.physics.add.collider(this.player, this.barriersGroup, () => this.gameOver());

        this.gameOverSound = this.sound.add("game-over-sound");
        this.scene.launch('StatsScene');
        this.scene.launch('PauseOverlayScene');
    }

    createPlayer() {
        const playerX = config.player.initialX;
        this.player = this.add.circle(playerX, this.height / 2, config.player.size, config.player.color);
        this.physics.add.existing(this.player);
        this.player.body.setCircle(config.player.size);
        this.player.body.velocity.x = config.player.speedX;
        // slowly increase horizontal speed
        this.player.body.setGravity(config.player.gravityX, config.player.gravityY);
        this.input.on("pointerdown", this.jump, this);
        this.input.keyboard.on('keydown-SPACE', this.jump, this);

        // camera follows players x coordinate, stays in the center of the screen
        const cameraShift = this.width / 2 - playerX;
        this.cameras.main.startFollow(this.player, false, 1, 0, -cameraShift, 0);
    }

    createBarriers() {
        this.barriersList = [];
        this.barriersGroup = this.physics.add.staticGroup();
        this.barriersGenerator = new BarrierGenerator(config.barriers.minLength, this.height, config.rngSeed);
        this.updateBarriers();
    }

    pushBarrier(x) {
        const barrier = this.barriersGenerator.generate(this, x);
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
            // the first barrier must appear a bit later then ordinary barrier,
            // otherwise player has no time to react at the start of the game
            this.pushBarrier(this.player.x + config.barriers.distanceBeetween * 1.5);
        }

        const maxX = this.player.x + this.width;
        let lastBarrier = this.barriersList[this.barriersList.length - 1];
        while (lastBarrier.x < maxX) {
            lastBarrier = this.pushBarrier(lastBarrier.x + config.barriers.distanceBeetween);
        }
    }

    getScore() {
        return Math.floor(this.player.x);
    }

    jump() {
        this.player.body.velocity.y -= config.player.speedBump;
    }

    update() {
        if (this.player.y <= 0 || this.player.y > this.height) {
            this.gameOver();
        }
        this.events.emit('score_update', this.getScore());
        this.updateBarriers();
    }

    gameOver() {
        // This function is called on collision before rendering the collision frame itself.
        // If we disable player immidiately it'll look like the player has not touched the barrier,
        // so small delay is used here to disable player just after rendering the next frame.
        this.time.delayedCall(1, () => this.player.body.setEnable(false));
        this.cameras.main.fade(config.fadeTime);
        this.time.delayedCall(config.fadeTime, () => this.scene.restart());
        stats.incTryCount();
        this.gameOverSound.play();
    }
}
