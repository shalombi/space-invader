'use strict';

const TIME_TRIGGER_ROCKET = 5000
const TIME_FREEZE_ALIENS = 5000
const TINE_CANDY_REMOVE = 1500
const TINE_CANDY_APPEAR = 3500
const SUPER_LASER_SIGN = '🗼';
const NEGS_BOMB_SIGN = '☢️'
const SHIELD_SIGN = '🛡'
const LIVE_SIGN = '🛰'

var gRocket = { isRocketLaunch: false, isHitMaster: false }
var gIsFirstClickToCustomize = true
var gIsBackgroundChanged = false
var gIsAliensCustomize = false
var gIsCustomize = false
var gIsFirstStep = true
var gIsBunkersLevel
var gRocketInterval
var gNextPosRocket
var gCandyInterval

//BLOW-UP NEGS WITH LASER FEATURE
function blowUpNegs(cellI, cellJ) {
  if (!gGame.isHitAlien || !gMaster.bombNegsRockets) return;
  gMaster.bombNegsRockets--
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gBoard[i].length) continue;
      playSoundNegs()
      // ALIEN = (i % 2 === 0) ? ALIEN1 : ALIEN2
      ALIEN = setGeneralAlienByRowIndex(i)
      if (gBoard[i][j].gameElement === ALIEN) {
        updateCell({ i, j });
        gGame.alienBornCount--
        updateScore(10)
      }
    }
  }
  gGame.isHitAlien = false;
  updateInfoInstruments(gMaster.bombNegsRockets, '.currBombNegs', NEGS_BOMB_SIGN)
  if (!gGame.alienBornCount) gameDone(true)
}

//FREEZE BTN
function freezeMode(elBtn) {
  if (!gGame.isOn) return

  var msg = (gGame.isFreezeMode) ? 'freeze mode' : 'exit freeze'
  elBtn.innerText = msg
  gGame.isFreezeMode = !gGame.isFreezeMode
}

function restartFreezeTextBtn() {
  gGame.isFreezeMode = false
  var elBtn = document.querySelector('.freeze-mode')
  elBtn.innerText = 'freeze-mode'
}

//CANDY FEATURE
function addAndRemoveCandy(board = gBoard) {

  if (gGame.isFreezeMode || !gGame.isOn || gIdxRowBottom < 1) return
  if (isRowClean(board, 0)) var coord = getEmptyCell();
  else return

  //ADD 
  if (!gBoard[coord.i][coord.j].gameElement) updateCell(coord, CANDY, CANDY)
  //REMOVE
  setTimeout(() => {
    if (!gGame.isOn) clearInterval(gCandyInterval)
    updateCell(coord)
  }, TINE_CANDY_REMOVE)
}

function hitCandy(pos) {
  updateCell(pos);
  updateScore(50)
  gGame.isFreezeMode = true
  gMaster.isShoot = false;
  setTimeout(() => { gGame.isFreezeMode = false }, TIME_FREEZE_ALIENS)
}

//ROCKETS LAND ON MASTER FEATURE
function getRocketTrigger(speed = 1000, typeLaser = ROCKET,) {
  if (gGame.isGameOver || gRocket.isRocketLaunch || gIdxRowBottom === gBoard.length - 4 || gGame.isFreezeMode) return;
  var coord = getCoordsForRocket()

  if (coord) gNextPosRocket = { i: ++coord.i, j: coord.j }
  else return

  if (gNextPosRocket.i < gBoard.length - 1) updateCell(gNextPosRocket, typeLaser, typeLaser);
  else return

  //Note:here, the rocket triggered.
  rocketLaunchedSound()
  gRocketInterval = setInterval(() => {
    rocketLaunched(gNextPosRocket, typeLaser);
  }, speed);
}

function rocketLaunched(pos, typeLaser = 'ROCKET') {
  if (gGame.isGameOver || !gGame.isOn) return;
  gRocket.isRocketLaunch = true

  //Remove -- general case
  if (gBoard[pos.i][pos.j].gameElement !== MASTER) updateCell(pos);

  //Note: private cases
  if (pos.i === gBoard.length - 2) {
    clearInterval(gRocketInterval);
    if (gBoard[pos.i][pos.j].gameElement !== MASTER) updateCell({ i: pos.i, j: pos.j });
    gRocket.isRocketLaunch = false
    return;
  }

  if (gBoard[pos.i + 1][pos.j].gameElement === BUNKER) {
    updateCell({ i: pos.i, j: pos.j })
    updateCell({ i: pos.i + 1, j: pos.j })
    clearInterval(gRocketInterval)
    return
  }

  var prevCell = { i: pos.i, j: pos.j }
  var nextCell = { i: ++pos.i, j: pos.j }
  if (nextCell.i === gMaster.pos.i && nextCell.j === gMaster.pos.j) {
    rocketHitsMaster(pos)
    gRocket.isRocketLaunch = false
    updateCell(prevCell);
    return
  }
  //Add -- general case
  updateCell(pos, typeLaser, typeLaser);
}

function rocketHitsMaster() {
  clearInterval(gRocketInterval);
  rocketHitMasterSound()
  if (gMaster.isShieldMode) return
  //Model
  gMaster.livesFromRockets--;
  gRocket.isHitMaster = true
  //DOM
  updateInfoInstruments(gMaster.livesFromRockets, '.currLives', LIVE_SIGN)

  if (!gMaster.livesFromRockets) gameDone(false)
}

function getCoordsForRocket(row = gIdxRowBottom, board = gBoard) {
  var rocketCoords = []
  //Note: start with j =1 ,end j = board[0].length-1 because there is a wall
  for (var j = 1; j < board[0].length - 1; j++) {
    ALIEN = setGeneralAlienByPose({ i: row, j: j })
    if (board[row][j].gameElement === ALIEN && board[row + 1][j].type === SPACE) {
      var rocketCoord = { i: row + 1, j: j }
      rocketCoords.push(rocketCoord)
    }
  }
  var randomIndex = (rocketCoords.length > 1) ? getRandomInt(1, rocketCoords.length) : 0
  return rocketCoords[randomIndex]
}

//SHIELD MODE 
function handleShieldMode() {
  if (!gMaster.shields || gGame.isGameOver) return
  //Model
  gMaster.isShieldMode = true
  gMaster.shields--

  updateInfoInstruments(gMaster.shields, '.curr-shield', SHIELD_SIGN)
  setTimeout(() => {
    gMaster.isShieldMode = false
  }, 5000)
}

//BUNKERS -- Note: the treatment of the hit Bunker by aliens - is in moveAllAliensLeft , moveAllAliensRight etc.
function makeBunkers(board = gBoard, iStart = 7, iEnd = 8, numOfBunkers = 6) {
  for (var i = iStart; i <= iEnd; i++) {
    for (var j = 1; j < 4; j++) { board[i][j].gameElement = BUNKER }
    for (var j = 8; j < 11; j++) { board[i][j].gameElement = BUNKER; }
  }
  gGame.counterBunkersBuild += numOfBunkers
}

function laserHitBunker(pos) {
  if (gLaserInterval) clearInterval(gLaserInterval)
  updateDataAndDisplayLaserHit(pos, BUNKER)
  return
}

function startSuperMode() {
  if (!gMaster.counterSuperMode || gMaster.isShoot || gGame.isGameOver) return;
  trigger(SPEED_SUPER_LASER, SUPER_LASER);
  updateInfoInstruments(--gMaster.counterSuperMode, '.curr-super-mode', SUPER_LASER_SIGN)
}

function addMoreBombs() {
  if (!gMaster.bombNegsRockets) updateInfoInstruments(gMaster.bombNegsRockets += 3, '.currBombNegs', NEGS_BOMB_SIGN)
}

//customize
function createBunker(elBtn, i, j) {
  if (!gIsCustomize || !gIsFirstClick || gGame.isOn) return
  if (gGame.alienBornCount > gGame.counterBunkersBuild) {
    updateCell({ i, j }, BUNKER, BUNKER)
    gGame.counterBunkersBuild++
  } else alert('You tried to create a bunker ,but, Aliens should be more than the bunkers,please click right click to create an alien')
  return
}

//on click right click make this  function start trigger
function createAlien(elBtn, i, j) {
  document.addEventListener('contextmenu', event => event.preventDefault());
  if (gGame.isOn || !gIsCustomize) return

  if (gIsFirstClickToCustomize) {
    gIdxRowTop = +prompt('enter the start row  to locate aliens please:')
    gIdxRowBottom = +prompt('enter the end row  to locate aliens please:')
    ALIEN_SPEED = +prompt('enter the speed of aliens please:')
  }
  gIsFirstClickToCustomize = false
  ALIEN = setGeneralAlienByRowIndex(i)
  updateCell({ i, j }, ALIEN, ALIEN)
  gGame.alienBornCount++
  ALIEN = ''
}

function customize() {
  if (gGame.isOn) return
  document.querySelector('.intro').style.display = 'none'
  gGame.alienBornCount = 0
  cleanAllAliensOnBoard()
  gIsCustomize = true
}

//background image 
function changeBackgroundImage() {
  if (!gIsBackgroundChanged) document.body.style.backgroundImage = "url('https://wallpaperset.com/w/full/2/0/c/62836.jpg')"
  if (gIsBackgroundChanged) document.body.style.backgroundImage = "url('https://wallpaperset.com/w/full/6/3/d/62904.jpg')"
  gIsBackgroundChanged = !gIsBackgroundChanged
}



