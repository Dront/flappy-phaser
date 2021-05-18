import Phaser from 'phaser';


export default class PauseOverlayScene extends Phaser.Scene {
    constructor() {
        super('PauseOverlayScene');
    }

    init() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;
    }

    preload() {
        const icon_size = Math.min(this.width, this.height) * 0.6;
        this.load.svg('pause', 'assets/pause-icon.svg', { width: icon_size, height: icon_size });
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
        const textPosY = pauseImg.y + pauseImg.height / 2 + this.height * 0.05;
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
