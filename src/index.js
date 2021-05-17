import Phaser from 'phaser';

import {Barrier} from './barrier';


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;

        this.speedMax = 800;
        this.speedBump = 500;
        this.speedX = this.width * 0.5;

        this.barrierShiftFromSide = 120;
        this.betweenBarriers = this.width * 0.5;
    }

    create() {
        const playerX = this.width * 1 / 3;
        // todo: collision box for circle is a rectangle for some reason, fix it
        this.player = this.add.circle(playerX, this.height / 2, 25, 0xff8800);
        this.physics.add.existing(this.player);
        this.player.body.velocity.x = this.speedX;
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

        // todo: draw game score and maybe save records?
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

    pauseGame() {
        this.scene.pause();
        this.scene.launch('PauseOverlayScene');
    }
}

class PauseOverlayScene extends Phaser.Scene {
    constructor() {
        super('PauseOverlayScene');
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;
    }

    preload() {
        const icon_size = Math.min(this.width, this.height) * 0.6;
        this.load.svg('pause', 'assets/pause-icon.svg', { width: icon_size, height: icon_size});
    }

    create() {
        this.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.3).setOrigin(0, 0);
        // if we allow any key here, random actions (like browser hotkeys) will unpause the game,
        // so use only selected keys here
        this.input.keyboard.on('keydown-ESC', this.unpause, this);
        this.input.keyboard.on('keydown-SPACE', this.unpause, this);
        this.input.keyboard.on('keydown-ENTER', this.unpause, this);

        const pauseImg = this.add.image(this.width / 2, this.height / 2, 'pause');
        pauseImg.setAlpha(0.5);

        // render help text a bit lower then pause symbol
        const textPosY = pauseImg.y + pauseImg.height / 2 + this.height * 0.1;
        const helpText = this.add.text(this.width / 2, textPosY, 'press space, esc or enter to continue');
        // otherwise hidpi display looks awful
        helpText.setResolution(2.0);
        helpText.x -= helpText.width / 2;
    }

    unpause() {
        this.scene.stop();
        this.scene.resume('GameScene');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#5DACD8",
    scene: [GameScene, PauseOverlayScene],
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
