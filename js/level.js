var gLevelChosen = false

function getLevel(level = 'levelOne') {
  if (gGame.isOn) return
  gLevelChosen = true

  if (gGame.isFreezeMode) restartFreezeTextBtn()
  if (gIsCustomize) gIsCustomize = false
  clearMyIntervals()

  if (level === 'levelOne') {
    COUNT_ALIENS_ROW = 3;
    COUNT_ALIENS_COL = 5;
    ALIEN_SPEED = 800
  } else if (level === 'levelTwo') {
    COUNT_ALIENS_ROW = 4;
    COUNT_ALIENS_COL = 5;
    ALIEN_SPEED = 300
  } else if (level === 'levelThree') {
    COUNT_ALIENS_ROW = 5;
    COUNT_ALIENS_COL = 5;
    ALIEN_SPEED = 200
  } else if (level === 'levelBunkers') {
    gIsBunkersLevel = true
    COUNT_ALIENS_ROW = 5;
    COUNT_ALIENS_COL = 3;
    ALIEN_SPEED = 100
  }
  init();
  startGame();
}

