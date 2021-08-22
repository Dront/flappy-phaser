import Phaser from 'phaser';

import config from './config';
import PauseOverlayScene from './pause_overlay_scene';
import GameScene from './game_scene';
import StatsScene from './stats_scene';


const phaserConfig = {
    type: Phaser.AUTO,
    // todo: lockOrientation?
    width: config.width,
    height: config.height,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: config.backgroundColor,
    scene: [GameScene, StatsScene, PauseOverlayScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
};

const game = new Phaser.Game(phaserConfig);
