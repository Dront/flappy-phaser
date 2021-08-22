import Phaser from 'phaser';

import * as stats from './stats';
import config from './config';


export default class StatsScene extends Phaser.Scene {
    constructor() {
        super('StatsScene');
    }

    init() {
        this.width = config.width;
        this.height = config.height;

        this.currentScore = 0;
        this.previousHighscore = stats.getHighscore();
        this.currentHighscore = this.previousHighscore;
    }

    create() {
        this.scoreText = this.add.text(this.width * 0.05, this.height * 0.05, this.getScoreText(), config.font);
        this.tryCountText = this.add.text(this.width * 0.9, this.height * 0.05, this.getTryCountText(), config.font);

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
