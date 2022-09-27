const FLOOR = 'FLOOR';
const SPACE = 'SPACE';
const WALL = 'WALL';

const BUNKER = '⬛'
const ROCKET = '☄️';
const MASTER = '🛰';
const CANDY = '🎁'

var ALIEN1 = "👾"
var ALIEN2 = "👽"
var ALIEN

var BOARD_SIZE = 12;
var gBoard;

function createBoard() {
  var board = createMat(BOARD_SIZE, BOARD_SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = { type: SPACE, gameElement: null };
      if (i === board.length - 1) cell = FLOOR;
      if (j === 0 || j === board[0].length - 1) cell = WALL;
      board[i][j] = cell;
    }
  }
  if (gIsBunkersLevel) makeBunkers(board)
  return board;
}

function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      var cellClass = 'cell-' + i + '-' + j;
      if (currCell === FLOOR) cellClass += ' floor';
      else if (currCell === WALL) cellClass += ' wall';
      strHTML += `\t<td class="cell ${cellClass}" onclick="createBunker(this,${i},${j})" oncontextmenu="createAlien(this,${i},${j})" >\n`;
      if (currCell.gameElement === ALIEN1) strHTML += ALIEN1
      if (currCell.gameElement === ALIEN2) strHTML += ALIEN2
      if (currCell.gameElement === MASTER) strHTML += MASTER;
      if (currCell.gameElement === ROCKET) strHTML += ROCKET;
      if (currCell.gameElement === BUNKER) strHTML += BUNKER;
      if (currCell.gameElement === CANDY) strHTML += CANDY;
      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }
  document.querySelector('tbody.board').innerHTML = strHTML;
}

