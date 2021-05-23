import Phaser from 'phaser';

import PauseOverlayScene from './pause_overlay_scene';
import GameScene from './game_scene';


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // this makes rendered text objects look better (by x2 amount of rendering needed)
    resolution: window.devicePixelRatio,
    backgroundColor: "#5DACD8",
    scene: [GameScene, PauseOverlayScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
};

const game = new Phaser.Game(config);
