const width = 960;
const height = 540;

// dynamic config modification is punishable by death
const config = {
    width: width,
    height: height,
    backgroundColor: "#5DACD8",
    font: {
        fontFamily: '"PixelEmulator"',
        fontSize: '20px',
        color: '#f7382a',
        resolution: 4,
    },
    player: {
        size: 25,
        initialX: width * 1 / 3,
        speedX: width * 0.5,
        speedBump: 500,
        gravityX: 5,
        gravityY: 1200,
        color: 0xff8800,
        pathColor: 0xff0000,
    },
    barriers: {
        width: 80,
        holeSize: height * (1 / 3),
        distanceBeetween: 400,
        minLength: 120,
        borderWidth: 1,
        borderColor: 0x080808,
    },
    fadeTime: 500, // ms
    // fixed seed can be set here to replay the same map
    // rngSeed: '1621771730784';
    rngSeed: 0,
};

export default config;
