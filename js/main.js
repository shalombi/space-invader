'use strict';

var gRocketsTriggerInterval
var gLaserPos;
var gNextPos;
var gMaster;
var gGame;

var gIsFirstClick = true


function init() {
  gGame = { isGameOver: true, isOn: false, alienBornCount: 0, score: 0, isHitAlien: false, isFreezeMode: false, counterBunkersBuild: 0 };
  gBoard = createBoard();
  createAliens(gBoard);
  createMaster(gBoard);
  renderBoard(gBoard);
  displayInformationInit();
  clearMyIntervals()
  gIdxRowTop = 0;
  gIdxRowBottom = gIdxRowTop + COUNT_ALIENS_ROW - 1;
}

function startGame() {
  if (gGame.isOn) return
  if (gLevelChosen || gIsCustomize) {
    document.querySelector('.intro').style.display = 'none'
    if (gIsFirstClick) playSoundStart()
    gGame.isGameOver = false;
    gIsBunkersLevel = false
    gIsFirstClick = false
    gGame.isOn = true
    moveBoardAlienLeft();

    gRocketsTriggerInterval = setInterval(getRocketTrigger, TIME_TRIGGER_ROCKET)
   gCandyInterval = setInterval(addAndRemoveCandy, TINE_CANDY_APPEAR)
  }
}

//MSG
function displayInformationInit() {
  document.querySelector('.curr-super-mode').innerText = getCharacters(gMaster.counterSuperMode, SUPER_LASER_SIGN)
  document.querySelector('.currBombNegs').innerText = getCharacters(gMaster.bombNegsRockets, NEGS_BOMB_SIGN)
  document.querySelector('.currLives').innerText = getCharacters(gMaster.livesFromRockets, LIVE_SIGN)
  document.querySelector('.curr-shield').innerText = getCharacters(gMaster.shields, SHIELD_SIGN)
  document.querySelector('.modalGameDone').style.display = 'none';
  updateScore(0)
}

