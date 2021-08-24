import Phaser from 'phaser';

import config from './config';
import InitScene from './init_scene';



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
    scene: [InitScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
};

const game = new Phaser.Game(phaserConfig);
