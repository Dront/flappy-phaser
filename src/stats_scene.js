import Phaser from 'phaser';

import * as stats from './stats';


export default class StatsScene extends Phaser.Scene {
    constructor() {
        super('StatsScene');
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;

        this.currentScore = 0;
        this.previousHighscore = stats.getHighscore();
        this.currentHighscore = this.previousHighscore;
    }

    create() {
        // todo: add styling and make it more visible on the background and barriers
        // todo: highlight score if this is a new highscore
        const fontSettings = {
            fontFamily: '"PixelEmulator"',
            fontSize: '20px',
            color: '#f7382a',
            resolution: 4,
        };
        this.scoreText = this.add.text(this.width * 0.05, this.height * 0.05, this.getScoreText(), fontSettings);
        this.tryCountText = this.add.text(this.width * 0.9, this.height * 0.05, this.getTryCountText(), fontSettings);

        this.scene.get('GameScene').events.on('score_update', newScore => {
            this.currentScore = newScore;
            if (this.currentScore > this.currentHighscore) {
                this.currentHighscore = this.currentScore;
                stats.setHighscore(this.currentHighscore);
            }
        });
    }

    getScoreText() {
        return `${this.currentScore} / ${this.previousHighscore}`;
    }

    getTryCountText() {
        return '#' + stats.getTryCount().toString();
    }

    update() {
        this.scoreText.setText(this.getScoreText());
    }
}
