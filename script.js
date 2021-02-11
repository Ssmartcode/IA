"use strict";

const player = document.querySelector(".player--0");
const playerScore = document.querySelector("#score--0");
const playerCurrent = document.getElementById("current--0");
const playerAi = document.querySelector(".player--1");
const aiCurrent = document.getElementById("current--1");
const aiScore = document.getElementById("score--1");
const messageBox = document.querySelector(".message");

const diceEl = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

let scores, currentScore, activePlayer, playing;
const messages = {
  welcome: "Welcome! Lets roll the dice",
  myTurn: "It is my turn now",
  yourTurn: "Your turn now",
  dice: "I rolled: ",
  hold: "I will hold the score",
  lost: "Congratz, you won",
  won: "Best of luck next time",
};

init();
//
btnRoll.addEventListener("click", function () {
  if (activePlayer === 0 && playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.classList.remove("hidden");
    diceEl.src = `diceImages/zar${dice}.png`;
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = currentScore;
    } else {
      player.classList.remove("player--active");
      currentScore = 0;
      playerCurrent.textContent = 0;
      activePlayer = 1;
      playerAiTurn();
    }
  }
});

btnHold.addEventListener("click", hold);

btnNew.addEventListener("click", init);
// Pause the game
const pause = (sec) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));
// LOGICA DIN SPATELE JUCATORULUI AI
async function playerAiTurn() {
  if (!playing && !activePlayer == 1) return;
  playerAi.classList.add("player--active");
  displayMessage(messages.myTurn);
  await pause(1);
  // keep on playing till 1 is rolled or hold
  while (true) {
    // roll the dice and display it on screen
    let dice = Math.trunc(Math.random() * 6) + 1;
    displayMessage(messages.dice + dice);
    diceEl.src = `diceImages/zar${dice}.png`;
    diceEl.classList.remove("hidden");
    // update the score
    currentScore += dice;
    aiCurrent.textContent = currentScore;
    await pause(1.5);
    // check if computer rolls 1
    if (dice === 1) {
      // update the score
      currentScore = 0;
      aiCurrent.textContent = currentScore;
      displayMessage(messages.yourTurn);
      // switch player
      activePlayer = 0;
      playerAi.classList.remove("player--active");
      player.classList.add("player--active");
      break;
    }
    // decide if the computer holds the current score
    const holdScore =
      calculateHoldScore(currentScore) ||
      scores[activePlayer] + currentScore >= 50;
    if (holdScore) {
      displayMessage(messages.hold);
      hold();
      activePlayer = 0;
      break;
    }
  }
}

// HOLD THE SCORE AND FIND THE WINNDER
function hold() {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.querySelector(`#score--${activePlayer}`).textContent =
      scores[activePlayer];
    currentScore = 0;
    document.querySelector(
      `#current--${activePlayer}`
    ).textContent = currentScore;
    player.classList.toggle("player--active");
    playerAi.classList.toggle("player--active");

    // CHOOSE THE WINNER
    if (scores[activePlayer] >= 50) {
      playing = false;
      diceEl.classList.add("hidden");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
      activePlayer === 1
        ? displayMessage(messages.won)
        : displayMessage(messages.lost);
    } else if (activePlayer === 0) {
      activePlayer = 1;
      playerAiTurn();
    } else {
      activePlayer = 1;
    }
  }
}
// DECID ATUNCI CAND JUCATORUL AI RETINE SCORUL
function calculateHoldScore(score) {
  const random = Math.trunc(Math.random() * 10 + 10);
  if (score > random) {
    return true;
  }
}
//AFISEZ MESAJUL
function displayMessage(message) {
  messageBox.textContent = message;
}
//INITIALIZEZ TOATE VARIABILELE LA 0
function init() {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  messageBox.textContent = messages.welcome;

  playerScore.textContent = 0;
  playerCurrent.textContent = 0;
  aiScore.textContent = 0;
  aiCurrent.textContent = 0;

  diceEl.classList.add("hidden");
  player.classList.remove("player--winner");
  player.classList.add("player--active");
  playerAi.classList.remove("player--winner");
  playerAi.classList.remove("player--active");
}
