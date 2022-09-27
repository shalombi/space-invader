var gIsGameWithSound = true



function playSoundStart() {
    if (!gIsGameWithSound) return
    var startGameSound = new Audio('sound/musicGame.mp3');
    startGameSound.play();
}

function playSoundLaser() {
    if (!gIsGameWithSound) return
    var laserSound = new Audio('sound/laser2.mp3');
    laserSound.play();
}

function playSoundNegs() {
    if (!gIsGameWithSound) return
    var negsSound = new Audio('sound/negs.mp3');
    negsSound.play();
}

function playSoundGameOver() {
    if (!gIsGameWithSound) return
    var gameOverSound = new Audio('sound/gameOver.mp3');
    gameOverSound.play();
}

function playWin() {
    if (!gIsGameWithSound) return
    var gameOverSound = new Audio('sound/win.mp3');
    gameOverSound.play();
}

function rocketHitMasterSound() {
    if (!gIsGameWithSound) return
    var gameOverSound = new Audio('sound/masterHitByRock.mp3');
    gameOverSound.play();
}

function rocketLaunchedSound() {
    if (!gIsGameWithSound) return
    var gameOverSound = new Audio('sound/rocketLaunched.mp3');
    gameOverSound.play();
}