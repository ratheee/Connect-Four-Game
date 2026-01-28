let btns = ["yellow", "red", "purple", "green"];
let gameSeq = [];
let userSeq = [];

let currentPlayer = 1;
let started = false;
let level = 0;

let scores = { p1: 0, p2: 0 };
let roundScores = { p1: 0, p2: 0 };
let lives = { p1: 5, p2: 5 };

const statusText = document.getElementById("status");
const finalResult = document.getElementById("finalResult");
const p1Box = document.getElementById("p1Box");
const p2Box = document.getElementById("p2Box");

function playSound(color) {
  let sound = document.getElementById(`sound-${color}`);
  if (sound) sound.play();
}

function flash(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 200);
}

function updateUI() {
  document.getElementById("p1Score").textContent = scores.p1;
  document.getElementById("p2Score").textContent = scores.p2;
  document.getElementById("p1Lives").textContent = lives.p1;
  document.getElementById("p2Lives").textContent = lives.p2;
  document.getElementById("p1RoundScore").textContent = roundScores.p1;
  document.getElementById("p2RoundScore").textContent = roundScores.p2;
  document.getElementById("liveP1").textContent = scores.p1;
  document.getElementById("liveP2").textContent = scores.p2;
}

function highlightPlayer() {
  p1Box.classList.remove("active");
  p2Box.classList.remove("active");
  if (currentPlayer === 1) p1Box.classList.add("active");
  else p2Box.classList.add("active");
}

function nextSequence() {
  userSeq = [];
  level++;
  statusText.textContent = `Level ${level} - Player ${currentPlayer}'s turn`;

  let randIdx = Math.floor(Math.random() * 4);
  let randColor = btns[randIdx];
  gameSeq.push(randColor);

  let randBtn = document.getElementById(randColor);
  flash(randBtn);
  playSound(randColor);
}

function checkAnswer(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      if (currentPlayer === 1) {
        roundScores.p1 += 10;
        scores.p1 += 10;
      } else {
        roundScores.p2 += 10;
        scores.p2 += 10;
      }
      updateUI();
      switchPlayer();
    }
  } else {
    playSound("wrong");
    document.body.classList.add("game-over");
    setTimeout(() => document.body.classList.remove("game-over"), 300);
    loseLife();
  }
}

function loseLife() {
  if (currentPlayer === 1) lives.p1--;
  else lives.p2--;

  updateUI();

  if (lives.p1 === 0 && lives.p2 === 0) {
    endGame();
  } else {
    switchPlayer();
  }
}

function switchPlayer() {
  if (lives.p1 === 0 && lives.p2 === 0) return endGame();
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  highlightPlayer();
  userSeq = [];
  gameSeq = [];
  setTimeout(nextSequence, 800);
}

function btnPress() {
  if (!started) return;
  let color = this.id;
  userSeq.push(color);
  userFlash(this);
  playSound(color);
  checkAnswer(userSeq.length - 1);
}

function startGame() {
  if (started) return;
  started = true;
  scores = { p1: 0, p2: 0 };
  roundScores = { p1: 0, p2: 0 };
  lives = { p1: 5, p2: 5 };
  level = 0;
  currentPlayer = 1;
  finalResult.textContent = "—";
  updateUI();
  highlightPlayer();
  statusText.textContent = "Game Started! Player 1's turn";
  nextSequence();
}

function endGame() {
  started = false;
  p1Box.classList.remove("active");
  p2Box.classList.remove("active");

  let winner =
    scores.p1 > scores.p2
      ? "Player 1 Wins 🥇"
      : scores.p2 > scores.p1
      ? "Player 2 Wins 🥇"
      : "It's a Draw 🤝";

  finalResult.textContent = winner;
  if (winner.includes("1")) p1Box.classList.add("winner");
  else if (winner.includes("2")) p2Box.classList.add("winner");

  statusText.innerHTML = `Game Over! ${winner}`;
}

function resetGame() {
  started = false;
  scores = { p1: 0, p2: 0 };
  roundScores = { p1: 0, p2: 0 };
  lives = { p1: 5, p2: 5 };
  level = 0;
  currentPlayer = 1;
  finalResult.textContent = "—";
  p1Box.classList.remove("winner");
  p2Box.classList.remove("winner");
  updateUI();
  statusText.textContent = "Game reset. Press Start to play again!";
}

document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("click", btnPress));
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);
