var COUNT_ALIENS_ROW = 3;
var COUNT_ALIENS_COL = 6;
var ALIEN_SPEED = 1500;
var gIntervalAliens;
var gIdxRowBottom;
var gIdxRowTop;


function moveBoardAlienLeft(board = gBoard) {
  gIntervalAliens = setInterval(() => {
    if (gIdxRowBottom === board.length - 2) gameDone(false)
    moveAllAliensLeft(board, gIdxRowBottom, gIdxRowTop);
    if (isAliensAtLeftEdge(board, gIdxRowTop, gIdxRowBottom)) {
      clearInterval(gIntervalAliens);
      setTimeout(() => {
        moveAllAliensDown(board, gIdxRowBottom, gIdxRowTop);
        moveBoardAliensRight();
      }, ALIEN_SPEED);
    }
  }, ALIEN_SPEED);
}

function moveBoardAliensRight(board = gBoard) {
  gIntervalAliens = setInterval(() => {
    if (gIdxRowBottom === board.length - 2) gameDone(false)
    moveAllAliensRight(board, gIdxRowBottom, gIdxRowTop);
    if (isAliensAtRightEdge(board, gIdxRowTop, gIdxRowBottom)) {
      clearInterval(gIntervalAliens);
      setTimeout(() => {
        moveAllAliensDown(board, gIdxRowBottom, gIdxRowTop);
        moveBoardAlienLeft();
      }, ALIEN_SPEED);
    }
  }, ALIEN_SPEED);
}

function moveAllAliensLeft(board = gBoard, iStart, iEnd) {
  if (gGame.isGameOver || gGame.isFreezeMode) return;
  for (var i = iStart; i >= iEnd; i--) {
    for (var j = 1; j < board[0].length - 1; j++) {

      const currBoardCell = board[i][j]
      const nextBoardCell = board[i][j - 1]
      const currCoordsCell = { i, j }
      const nextCoordsCell = { i: i, j: j - 1 }
      ALIEN = setGeneralAlienByPose(currCoordsCell)

      if (currBoardCell.gameElement !== ALIEN || (nextBoardCell.gameElement && nextBoardCell.gameElement !== BUNKER) || nextBoardCell === WALL) continue;
      if (nextBoardCell.gameElement === BUNKER) return updateCellsAfterCollision(true, false, true, i, j)
      if (nextBoardCell.gameElement === MASTER) {
        updateCell(currCoordsCell)
        gGame.alienBornCount--
        continue
      }
      updateCell(currCoordsCell);
      updateCell(nextCoordsCell, ALIEN, ALIEN);
    }
  }
  return
}

function moveAllAliensRight(board = gBoard, iStart, iEnd) {
  if (gGame.isGameOver || gGame.isFreezeMode) return;
  for (var i = iStart; i >= iEnd; i--) {
    for (var j = board[0].length - 2; j > 0; j--) {

      const nextBoardCell = board[i][j + 1]
      const currBoardCell = board[i][j]
      const nextCoordsCell = { i: i, j: j + 1 }
      const currCoordsCell = { i, j }
      ALIEN = setGeneralAlienByPose(currCoordsCell)

      if (currBoardCell.gameElement !== ALIEN || (nextBoardCell.gameElement && nextBoardCell.gameElement !== BUNKER) || nextBoardCell === WALL) continue;
      if (nextBoardCell.gameElement === BUNKER) return updateCellsAfterCollision(false, false, true, i, j)
      if (nextBoardCell.gameElement === MASTER) {
        updateCell(currCoordsCell)
        gGame.alienBornCount--
        continue
      }
      updateCell(currCoordsCell);
      updateCell(nextCoordsCell, ALIEN, ALIEN);
    }
  }
  return
}

function moveAllAliensDown(board = gBoard, iStart, iEnd) {
  if (gGame.isGameOver || gGame.isFreezeMode) return;
  for (var i = iStart; i >= iEnd; i--) {
    for (var j = 1; j < board[0].length - 1; j++) {
      const currBoardCell = board[i][j]
      const nextBoardCell = board[i + 1][j]
      const currCoordsCell = { i, j }
      const nextCoordsCell = { i: i + 1, j: j }
      ALIEN = setGeneralAlienByPose(currCoordsCell)

      if (nextCoordsCell.gameElement || nextBoardCell === WALL || currBoardCell.gameElement !== ALIEN) continue;
      if (board[i + 1][j].gameElement === BUNKER) return updateCellsAfterCollision(false, true, false, i, j)
      if (nextBoardCell.gameElement === MASTER) {
        updateCell(currCoordsCell)
        gGame.alienBornCount--
        continue
      }
      updateCell({ i, j });
      updateCell({ i: i + 1, j: j }, ALIEN, ALIEN);
    }
  }
  if (gIdxRowTop === 1) gCandyInterval = setInterval(addAndRemoveCandy, TINE_CANDY_APPEAR)
  if (isRowClean(gBoard, gIdxRowTop)) gIdxRowTop++
  if (isRowCleanFromBunkers(gBoard, gIdxRowBottom)) gIdxRowBottom++;
  if (gIdxRowBottom === board.length - 1) gameDone(false)
  return
}

function isAliensAtLeftEdge(board = gBoard, iStart, iEnd) {
  for (var i = iStart; i <= iEnd; i++) {
    ALIEN = (board[i][1].gameElement === ALIEN1) ? ALIEN1 : ALIEN2
    if (board[i][1].gameElement === ALIEN) return true;
  }
}

function isAliensAtRightEdge(board = gBoard, iStart, iEnd) {
  for (var i = iStart; i <= iEnd; i++) {
    ALIEN = (board[i][board[0].length - 2].gameElement === ALIEN1) ? ALIEN1 : ALIEN2
    if (board[i][board[0].length - 2].gameElement === ALIEN) return true;
  }
}

function isRowClean(board = gBoard, row) {
  for (var j = 1; j < board.length - 1; j++) {
    ALIEN = setGeneralAlienByPose({ i: row, j: j })
    if (board[row][j].gameElement === ALIEN) return false;
  }
  return true;
}

function isRowCleanFromBunkers(board = gBoard, row) {
  for (var j = 1; j < board.length - 1; j++) {
    ALIEN = setGeneralAlienByPose({ i: row, j: j })
    if (board[row][j].gameElement === BUNKER) return false;
  }
  return true;
}

function createAliens(board = gBoard) {
  for (var i = 0; i < COUNT_ALIENS_ROW; i++) {
    for (var j = board[0].length - 1 - COUNT_ALIENS_COL; j < board[0].length - 1; j++) {
      //Model
      gGame.alienBornCount++
      ALIEN = setGeneralAlienByRowIndex(i)
      board[i][j].gameElement = ALIEN
      //Note: update DOM by renderBoard function,this function called after this (createAliens())function.
    }
  }
}

function updateCellsAfterCollision(isLeft, isDown, isHorizontalMove, i, j) {
  if (gGame.counterBunkersBuild) gGame.counterBunkersBuild--
  if (gGame.alienBornCount) gGame.alienBornCount--
  if (!gGame.alienBornCount) gameDone(true)
  updateCell({
    i: (isDown && !isHorizontalMove) ? (i + 1) : (i),
    j: (isHorizontalMove) ? (isLeft) ? (j - 1) : (j + 1) : (j)
  });
  updateCell({ i, j });
  return
}

