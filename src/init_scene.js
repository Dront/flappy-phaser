import Phaser from 'phaser';

import config from './config';
import GameScene from './game_scene';
import PauseOverlayScene from './pause_overlay_scene';
import StatsScene from './stats_scene';
import {getHighscore, getTryCount} from './stats';


export default class InitScene extends Phaser.Scene {
    constructor() {
        super('InitScene');
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;
    }

    preload() {
        const playSize = this.height * 0.6;
        this.load.svg('play', 'assets/play-icon.svg', { width: playSize, height: playSize });
    }

    create() {
        // if we allow any key here, random actions (like browser hotkeys) will unpause the game,
        // so use only selected keys here
        this.input.keyboard.on('keydown-SPACE', this.play, this);
        this.input.keyboard.on('keydown-ENTER', this.play, this);

        const playImg = this.add.image(this.width / 2, this.height / 3, 'play');
        playImg.setInteractive();
        playImg.on('pointerdown', this.play, this);

        const helpTextPosY = playImg.y + playImg.height / 2 + this.height * 0.05;
        this.addText(this.width / 2, helpTextPosY, 'press space or enter to start');

        const attempTextPosY = helpTextPosY + this.height * 0.1;
        const attemptNum = getTryCount();
        let attemptText = `attempt ${attemptNum}`;
        if (attemptNum == 0) {
            attemptText = `first attempt!`;
        }
        this.addText(this.width / 2, attempTextPosY, attemptText);

        if (attemptNum == 0) {
            return;
        }

        this.addText(this.width / 2, attempTextPosY + this.height * 0.1, `highscore ${getHighscore()}`);
    }

    addText(x, y, text) {
        const textObj = this.add.text(x, y, text, config.font);
        textObj.x -= textObj.width / 2;
    }

    play() {
        this.scene.add('GameScene', GameScene, true);
        this.scene.add('StatsScene', StatsScene, true);
        this.scene.add('PauseOverlayScene', PauseOverlayScene, true);
        this.scene.stop();
    }
}
