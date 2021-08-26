import Phaser from 'phaser'
import WebFontLoader from 'webfontloader'


export default class WebFontFile extends Phaser.Loader.File
{
	/**
	 * @param {Phaser.Loader.LoaderPlugin} loader
     * @param {string} fontFamily
	 */
	constructor(loader, fontFamily) {
		super(loader, {
			type: 'webfont',
			key: fontFamily,
		})
		this.fontFamily = fontFamily;
	}

	load() {
		WebFontLoader.load({
			active: () => {
				this.loader.nextFile(this, true)
			},
            custom: {
                families: [this.fontFamily],
            }
		});
	}
}
