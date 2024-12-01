const Gameboard = (() => {
    let board = Array(9).fill(null); // 3x3 board
  
    const resetBoard = () => {
      board.fill(null);
    };
  
    const setMark = (index, mark) => {
      if (!board[index]) {
        board[index] = mark;
        return true;
      }
      return false; // Spot already taken
    };
  
    const getBoard = () => board;
  
    const checkWinner = () => {
      const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
  
      for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a]; // Return winner ("X" or "O")
        }
      }
      return board.includes(null) ? null : "Tie"; // Return "Tie" if no winner and no empty spots
    };
  
    return { resetBoard, setMark, getBoard, checkWinner };
  })();
  
  const Player = (name, mark) => {
    return { name, mark };
  };
  
  const GameController = (() => {
    const player1 = Player("PlayerOne", "X");
    const player2 = Player("PlayerTwo", "O");
    let currentPlayer = player1;
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const playRound = (cellIndex) => {
      if (Gameboard.setMark(cellIndex, currentPlayer.mark)) {
        const winner = Gameboard.checkWinner();
        if (winner) {
          if (winner === "Tie") {
            console.log("It's a tie!");
            DisplayController.showResult("It's a tie!");
          } else {
            console.log(`${currentPlayer.name} (${currentPlayer.mark}) wins!`);
            DisplayController.showResult(`${currentPlayer.name} wins!`);
          }
          return true; // Game over
        }
        switchPlayer();
      } else {
        console.log("Spot already taken!");
      }
      return false; // Game continues
    };
  
    const resetGame = () => {
      Gameboard.resetBoard();
      currentPlayer = player1;
      DisplayController.renderBoard();
      DisplayController.showResult("Game reset. Make your move!");
    };
  
    return { playRound, resetGame, currentPlayer, player1, player2 };
  })();
  
  const DisplayController = (() => {
    const cells = document.querySelectorAll("[data-cell]");
    const resultDiv = document.getElementById("result");
  
    const renderBoard = () => {
      const board = Gameboard.getBoard();
      cells.forEach((cell, index) => {
        cell.textContent = board[index];
      });
    };
  
    const showResult = (message) => {
      resultDiv.textContent = message;
    };
  
    cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        if (!GameController.playRound(index)) {
          renderBoard();
        } else {
          renderBoard(); // Update board after game over
        }
      });
    });
  
    document.getElementById("reset-game").addEventListener("click", () => {
      const player1Name = document.getElementById("player1").value.trim();
      const player2Name = document.getElementById("player2").value.trim();
  
      if (player1Name && player2Name) {
        GameController.player1.name = player1Name;
        GameController.player2.name = player2Name;
        GameController.resetGame();
      } else {
        alert("Please enter names for both players!");
      }
    });
  
    return { renderBoard, showResult };
  })();
  
  // Initialize the game
  GameController.resetGame();
  