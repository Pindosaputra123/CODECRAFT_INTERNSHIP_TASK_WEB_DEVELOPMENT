let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = 2;

function startGame(selectedMode) {
  mode = selectedMode;
  document.getElementById("modeSelect").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  drawBoard();
  updateStatus();
}

function drawBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  board.forEach((cell, index) => {
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    cellEl.textContent = cell;
    cellEl.addEventListener("click", () => handleCellClick(index));
    boardEl.appendChild(cellEl);
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  drawBoard();

  if (checkWin()) {
    gameActive = false;
    document.getElementById("status").textContent = `${currentPlayer} Menang! 🎉`;
    return;
  }

  if (board.every(cell => cell !== "")) {
    gameActive = false;
    document.getElementById("status").textContent = "Seri 😐!";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  if (mode === 1 && currentPlayer === "O") {
    setTimeout(botMove, 500);
  }
}

function botMove() {
  let emptyIndices = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter(v => v !== null);

  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  handleCellClick(randomIndex);
}

function checkWin() {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return winCombos.some(combo => {
    const [a, b, c] = combo;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function updateStatus() {
  document.getElementById("status").textContent = `Giliran: ${currentPlayer}`;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  drawBoard();
  updateStatus();
}

function goBackToMenu() {
  resetGame();
  document.getElementById("gameContainer").classList.add("hidden");
  document.getElementById("modeSelect").classList.remove("hidden");
}
