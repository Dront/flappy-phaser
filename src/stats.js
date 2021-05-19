const highscoreKey = 'highscore';
const tryCountKey = 'tryCount';


export function getHighscore() {
    return parseInt(localStorage.getItem(highscoreKey)) || 0;
}

export function setHighscore(value) {
    return localStorage.setItem(highscoreKey, value);
}


export function getTryCount() {
    return parseInt(localStorage.getItem(tryCountKey)) || 0;
}

export function incTryCount() {
    return localStorage.setItem(tryCountKey, getTryCount() + 1);
}
