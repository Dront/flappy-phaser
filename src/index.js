import Phaser from 'phaser';

import PauseOverlayScene from './pause_overlay_scene';
import GameScene from './game_scene';


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
