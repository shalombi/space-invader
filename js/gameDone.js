function gameDone(isWin) {

  //MODEL
  clearMyIntervals()
  gGame.isGameOver = true;
  gNextPosRocket = null
  gMaster.isWin = isWin
  gIsCustomize = false
  gGame.isOn = false

  //SOUND

    if (gMaster.isWin) playWin()
    else playSoundGameOver()


  //DOM
  var elModal = document.querySelector('.modalGameDone');
  var msgGameDone = gMaster.isWin ? 'you won!' : 'you lose!';
  msgGameDone += '<br><button class="restartBtn" onmousedown="getLevel()">restart</button>';
  elModal.innerHTML = msgGameDone;
  elModal.style.display = 'block';

  return;
}


