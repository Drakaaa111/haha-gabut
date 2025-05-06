let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let againstAI = false;
let difficulty = "easy";
let aiPlayer = "O";
let humanPlayer = "X";

const statusEl = document.querySelector(".status");
const boardEl = document.getElementById("board");
const gameEl = document.getElementById("game");
const menuEl = document.getElementById("menu");
const modeMenuEl = document.getElementById("modeMenu");
const difficultyMenuEl = document.getElementById("difficultyMenu");
const thankYouPageEl = document.getElementById("thankYouPage");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let scoreX = 0;
let scoreO = 0;

function showGameMode() {
  menuEl.style.display = "none";
  modeMenuEl.style.display = "block";
}

function showDifficultySelector() {
  modeMenuEl.style.display = "none";
  difficultyMenuEl.style.display = "block";
}

function startGame(mode) {
  againstAI = mode === "ai";
  modeMenuEl.style.display = "none";
  gameEl.style.display = "block";
  resetBoard();
}

function startGameWithAI(level) {
  againstAI = true;
  difficulty = level;
  aiPlayer = "O";
  humanPlayer = "X";
  difficultyMenuEl.style.display = "none";
  gameEl.style.display = "block";
  resetBoard();
}

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  boardEl.innerHTML = "";
  statusEl.textContent = `Giliran: ${currentPlayer}`;
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    boardEl.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  clickSound.play();

  if (checkWinner()) {
    gameActive = false;
    statusEl.textContent = `${currentPlayer} menang!`;
    winSound.play();
    updateScore(currentPlayer);
    setTimeout(() => {
      if (scoreX >= 5 || scoreO >= 5) {
        showThankYou();
      }
    }, 1000);
    return;
  }

  if (!board.includes("")) {
    statusEl.textContent = "Seri!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `Giliran: ${currentPlayer}`;

  if (againstAI && currentPlayer === aiPlayer) {
    setTimeout(() => {
      aiMove();
    }, 500);
  }
}

function updateScore(winner) {
  if (winner === "X") {
    scoreX++;
    document.getElementById("scoreX").textContent = scoreX;
  } else {
    scoreO++;
    document.getElementById("scoreO").textContent = scoreO;
  }
}

function checkWinner() {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      document.querySelector(`[data-index="${a}"]`).classList.add("winner");
      document.querySelector(`[data-index="${b}"]`).classList.add("winner");
      document.querySelector(`[data-index="${c}"]`).classList.add("winner");
      return true;
    }
  }
  return false;
}

function aiMove() {
  let move;

  if (difficulty === "easy") {
    move = getRandomMove();
  } else if (difficulty === "medium") {
    move = Math.random() < 0.5 ? getBestMove() : getRandomMove();
  } else {
    move = getBestMove();
  }

  board[move] = aiPlayer;
  const cell = document.querySelector(`[data-index="${move}"]`);
  if (cell) {
    cell.textContent = aiPlayer;
    clickSound.play();
  }

  if (checkWinner()) {
    statusEl.textContent = `${aiPlayer} menang!`;
    gameActive = false;
    updateScore(aiPlayer);
    winSound.play();
    setTimeout(() => {
      if (scoreX >= 5 || scoreO >= 5) {
        showThankYou();
      }
    }, 1000);
    return;
  }

  if (!board.includes("")) {
    statusEl.textContent = "Seri!";
    gameActive = false;
    return;
  }

  currentPlayer = humanPlayer;
  statusEl.textContent = `Giliran: ${currentPlayer}`;
}

function getRandomMove() {
  const empty = board.map((val, idx) => (val === "" ? idx : null)).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWin(aiPlayer)) return 10 - depth;
  if (checkWin(humanPlayer)) return depth - 10;
  if (!board.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = aiPlayer;
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = humanPlayer;
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = "";
      }
    }
    return best;
  }
}

function checkWin(player) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

function resetGame() {
  resetBoard();
}

function backToModeSelection() {
  gameEl.style.display = "none";
  modeMenuEl.style.display = "block";
}

function showThankYou() {
  gameEl.style.display = "none";
  thankYouPageEl.style.display = "flex";
}
