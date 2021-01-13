"use strict";

// Selecting elements
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
  welcome: "Ma bucur sa te vad",
  myTurn: "Este randul meu sa joc",
  yourTurn: "Fata zarului arata 1. Este randul tau acum",
  dice: "Zarul aruncat a fost un: ",
  hold: "Voi retine scorul",
  lost: "Felicitari, ai castigat",
  won: "Mult noroc data viitoare",
};
// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  messageBox.innerHTML = messages.welcome;

  playerScore.textContent = 0;
  playerCurrent.textContent = 0;
  aiScore.textContent = 0;
  aiCurrent.textContent = 0;

  diceEl.classList.add("hidden");
  player.classList.remove("player--winner");
  player.classList.add("player--active");
  playerAi.classList.remove("player--winner");
  playerAi.classList.remove("player--active");
};
init();
const displayMessage = (message) => {
  messageBox.innerHTML = message;
};
const playerAiTurn = () => {
  diceEl.classList.remove("hidden");
  if (playing && activePlayer == 1) {
    playerAi.classList.add("player--active");
    displayMessage(messages.myTurn);
    let dice = 0;

    let aiPlays = setInterval(() => {
      dice = Math.trunc(Math.random() * 6) + 1;
      displayMessage(messages.dice + dice);
      diceEl.src = `zaruri/zar${dice}.png`;
      currentScore += dice;
      aiCurrent.textContent = currentScore;
      const holdScore = calculateHoldScore(currentScore);
      if (dice === 1) {
        currentScore = 0;
        aiCurrent.textContent = currentScore;
        displayMessage(messages.yourTurn);
        activePlayer = 0;
        playerAi.classList.remove("player--active");
        player.classList.add("player--active");
        clearInterval(aiPlays);
      } else if (holdScore) {
        displayMessage(messages.dice + dice + ". " + messages.hold);
        hold();
        activePlayer = 0;
        clearInterval(aiPlays);
      }
    }, 1500);
  }
};

btnRoll.addEventListener("click", function () {
  if (activePlayer === 0 && playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.classList.remove("hidden");
    diceEl.src = `zaruri/zar${dice}.png`;
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
    if (scores[activePlayer] >= 50) {
      playing = false;
      diceEl.classList.add("hidden");

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
    } else if (activePlayer === 0) {
      activePlayer = 1;
      playerAiTurn();
    } else {
      activePlayer = 1;
    }
  }
}

function calculateHoldScore(score) {
  const random = Math.trunc(Math.random() * 10 + 10);
  if (score > random) {
    return true;
  }
}
