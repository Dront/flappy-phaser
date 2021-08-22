import Phaser from 'phaser';

import config from './config';


export default class PauseOverlayScene extends Phaser.Scene {
    constructor() {
        super('PauseOverlayScene');
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;
    }

    preload() {
        const pauseSize = this.height * 0.2;
        this.load.svg('pause', 'assets/pause-icon.svg', { width: pauseSize, height: pauseSize });
        const playSize = this.height * 0.6;
        this.load.svg('play', 'assets/play-icon.svg', { width: playSize, height: playSize });
    }

    create() {
        const btnShift = this.height * 0.05;
        this.pausebtn = this.add.image(btnShift, this.height - btnShift, 'pause');
        this.pausebtn.setAlpha(0.6);
        this.pausebtn.setOrigin(0, 1);

        this.pausebtn.setInteractive();
        this.pausebtn.on('pointerdown', this.pause, this);

        this.input.keyboard.on('keydown-ESC', this.pause, this);
    }

    pause() {
        this.scene.pause('GameScene');

        this.pausebtn.destroy();

        this.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.3).setOrigin(0, 0);

        // if we allow any key here, random actions (like browser hotkeys) will unpause the game,
        // so use only selected keys here
        this.input.keyboard.on('keydown-ESC', this.play, this);
        this.input.keyboard.on('keydown-SPACE', this.play, this);
        this.input.keyboard.on('keydown-ENTER', this.play, this);

        const playImg = this.add.image(this.width / 2, this.height / 2, 'play');
        playImg.setAlpha(0.6);
        playImg.setInteractive();
        playImg.on('pointerdown', this.play, this);

        // render help text a bit lower then play symbol
        const textPosY = playImg.y + playImg.height / 2 + this.height * 0.05;
        const helpText = this.add.text(this.width / 2, textPosY, 'press space esc or enter to continue', config.font);
        helpText.x -= helpText.width / 2;
    }

    play() {
        this.scene.resume('GameScene');
        this.scene.restart();
    }
}
