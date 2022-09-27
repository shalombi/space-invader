function createMat(ROWS, COLS) {
  var mat = [];
  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      row.push('');
    }
    mat.push(row);
  }
  return mat;
}

function handleKey(ev) {
  if (gGame.isGameOver) return;

  switch (ev.key) {
    case 'ArrowLeft':
    case 'D':
    case 'd':
    case 'ג':
      moveMaster(-1);
      break;
    case 'ArrowRight':
    case 'F':
    case 'f':
    case 'כ':
      moveMaster(1);
      break;
    case ' ':
      trigger();
      break;
    case 'N':
    case 'n':
    case 'מ':
      if (gGame.isHitAlien) blowUpNegs(gNextPos.i, gNextPos.j);
      break;
    case 'X':
    case 'x':
    case 'ס':

      startSuperMode();
      break;
    case 'Z':
    case 'z':
    case 'ז':
      handleShieldMode()
    case 'P':
    case 'p':
    case 'פ':
      addMoreBombs()
  }
}

function updateCell(pos, gameElement = null, display = '') {
  gBoard[pos.i][pos.j].gameElement = gameElement;

  var selectorCell = '.cell-' + pos.i + '-' + pos.j;
  document.querySelector(selectorCell).innerHTML = display;
}

function setGeneralAlienByPose(pos) {
  ALIEN = (gBoard[pos.i][pos.j].gameElement === ALIEN1) ? ALIEN1 : ALIEN2
  return ALIEN
}

function setGeneralAlienByRowIndex(rowIndex) {
  ALIEN = (rowIndex % 2 === 0) ? ALIEN1 : ALIEN2
  return ALIEN
}

function getEmptyCell(board = gBoard, row = 0) {
  var emptyCoords = [];

  for (var j = 0; j < board[0].length; j++) {
    var currCell = board[row][j]
    if (currCell.gameElement === null && currCell.type === SPACE) {
      var coord = { i: row, j: j }
      emptyCoords.push(coord);
    } else {
      continue
    }
  }
  return emptyCoords[getRandomInt(0, emptyCoords.length)];
}

function cleanAllAliensOnBoard(board = gBoard) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      ALIEN = setGeneralAlienByPose({ i, j })
      if (board[i][j].gameElement === ALIEN) updateCell({ i, j })
    }
  }
  gGame.alienBornCount = 0
}

function clearMyIntervals() {
  clearInterval(gIntervalAliens)
  clearInterval(gLaserInterval)
  clearInterval(gCandyInterval)
  clearInterval(gRocketInterval)
  clearInterval(gRocketsTriggerInterval)
  gCandyInterval = ''
  gIntervalAliens = ''
  gLaserInterval = ''
  gRocketInterval = ''
  gRocketsTriggerInterval = ''

}

function updateScore(score) {
  //Modal
  gGame.score += score;
  //DOM
  var elScore = document.querySelector('.curr-score')
  elScore.innerText = gGame.score
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// Disable arrow key scrolling page in users browser
window.addEventListener(
  'keydown',
  function (e) {
    if (
      ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault();
    }
  },
  false
);

//reload page
function restartAllPage() { window.location.reload() }

//update info of instruments(laser,lives,bomb, etc).
function updateInfoInstruments(modelInfo, className, instrument) {
  var currInstrument = getCharacters(modelInfo, instrument)
  var elInstrument = document.querySelector(className)
  elInstrument.innerText = currInstrument
}

function getCharacters(length, char) {
  var counter = 0;
  var charStr = '';
  while (counter < length) {
    charStr += char;
    counter++;
  }
  return charStr;
}

//utils function for check game
function getBoardElements(board = gBoard) {
  var mat = []
  for (var i = 0; i < board.length; i++) {
    mat[i] = []
    for (var j = 0; j < board.length; j++) {
      mat[i][j] = board[i][j].gameElement
    }
  }
  return mat
}

function cleanRocketRow(row, board = gBoard) {
  for (var j = 0; j < board[0].length; j++) {
    if (board[row][j].gameElement === ROCKET) {
      updateCell({ i: row, j: j })
    }
  }
}

