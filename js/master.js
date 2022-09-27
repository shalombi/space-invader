const SPEED_SUPER_LASER = 10;
const SIMPLE_LASER = '🔺';
const SUPER_LASER = '🗼';

var SPEED_LASER = 25;
var gLaserInterval;

function createMaster(board) {
  var masterPos = { i: board.length - 2, j: Math.floor((board[0].length - 1) / 2), };
  gMaster = {
    pos: masterPos,
    isShieldMode: false,
    isShoot: false,
    isWin: false,
    livesFromRockets: 3,
    counterSuperMode: 3,
    bombNegsRockets: 3,
    shields: 3,
  };
  board[gMaster.pos.i][gMaster.pos.j].gameElement = MASTER;
}

function moveMaster(dir) {
  if (gGame.isGameOver) return;
  var nextCol = gMaster.pos.j + dir;
  var nextCell = gBoard[gMaster.pos.i][nextCol];
  if (nextCell.type !== SPACE) return;
  updateCell(gMaster.pos);
  gMaster.pos.j = nextCol;
  updateCell(gMaster.pos, MASTER, MASTER);
}

function trigger(speed = SPEED_LASER, typeLaser = SIMPLE_LASER) {
  playSoundLaser()
  if (gGame.isGameOver || gMaster.isShoot) return;
  gMaster.isShoot = true;
  gNextPos = { i: gMaster.pos.i - 1, j: gMaster.pos.j };
  ALIEN = setGeneralAlienByPose(gNextPos)

  if (gBoard[gNextPos.i][gNextPos.j].gameElement === ALIEN) {
    laserHitsAlien(gNextPos)
    if ((!gGame.alienBornCount)) gameDone(true);
    return
  }

  updateCell(gNextPos, typeLaser, typeLaser);

  gLaserPos = gNextPos;
  gLaserInterval = setInterval(() => {
    launchLaser(gLaserPos, typeLaser);
  }, speed);
}

function launchLaser(pos, typeLaser) {
  updateCell(pos);
  if (pos.i === 0) {
    clearInterval(gLaserInterval);
    gMaster.isShoot = false;
    return;
  }

  var gNextPos = { i: pos.i - 1, j: pos.j }

  ALIEN = setGeneralAlienByPose(gNextPos)

  if (gBoard[gNextPos.i][gNextPos.j].gameElement === ALIEN) {
    clearInterval(gLaserInterval);
    laserHitsAlien(gNextPos);
    return;
  } else if (gBoard[gNextPos.i][gNextPos.j].gameElement === CANDY) {
    clearInterval(gLaserInterval);
    hitCandy(gNextPos)
    return
  } else if (gBoard[gNextPos.i][gNextPos.j].gameElement === BUNKER) {
    clearInterval(gLaserInterval);
    laserHitBunker(gNextPos)
    return
  }
  pos.i--
  updateCell(pos, typeLaser, typeLaser);
}

function laserHitsAlien(pos) {
  clearInterval(gLaserInterval)
  ALIEN = setGeneralAlienByPose(pos)
  updateDataAndDisplayLaserHit(pos, ALIEN, 10)
  if (isRowClean(gBoard, pos.i)) gIdxRowBottom--;
  if ((!gGame.alienBornCount)) gameDone(true);
  return;
}

function updateDataAndDisplayLaserHit(pos, affectedElement, score = 0) {
  if (score) updateScore(score)
  if (affectedElement === BUNKER) {
    gGame.counterBunkersBuild--
  } else if (affectedElement === ALIEN) {
    gGame.alienBornCount--
    gGame.isHitAlien = true;
  }
  gMaster.isShoot = false
  updateCell(pos);
}


