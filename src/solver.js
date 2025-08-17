/**
 * Sudoku Solver using Backtracking Algorithm
 */

// Check if a number is valid in a specific position
function isValid(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
}

// Find empty cell (returns [row, col] or null if no empty cells)
function findEmptyCell(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
}

// Main solving function using backtracking
function solveSudoku(board) {
  const emptyCell = findEmptyCell(board);
  
  // If no empty cells, puzzle is solved
  if (!emptyCell) {
    return true;
  }

  const [row, col] = emptyCell;

  // Try numbers 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      // Recursively solve
      if (solveSudoku(board)) {
        return true;
      }

      // Backtrack
      board[row][col] = 0;
    }
  }

  return false;
}

// Validate if the initial board is valid
function isValidBoard(board) {
  // Check all rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }
  
  // Check all columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
      const num = board[row][col];
      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }
  
  // Check all 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          const num = board[row][col];
          if (num !== 0) {
            if (seen.has(num)) return false;
            seen.add(num);
          }
        }
      }
    }
  }
  
  return true;
}

// Get a hint by finding one valid cell
function getHint(board) {
  const originalBoard = board.map(row => [...row]);
  
  if (solveSudoku(originalBoard)) {
    // Find the first empty cell in the original board
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return {
            row,
            col,
            value: originalBoard[row][col]
          };
        }
      }
    }
  }
  
  return null;
}

// Create a deep copy of the board
function copyBoard(board) {
  return board.map(row => [...row]);
}

export {
  solveSudoku,
  isValidBoard,
  getHint,
  copyBoard
};
