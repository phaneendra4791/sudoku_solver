/**
 * Advanced Sudoku Solver with Multiple Techniques
 * Implements constraint propagation, naked singles, hidden singles, and backtracking
 * Guarantees 100% accuracy for all valid Sudoku puzzles
 */

class SudokuSolver {
  constructor() {
    this.solvingSteps = [];
    this.candidates = [];
  }

  // Initialize candidate sets for each cell
  initializeCandidates(board) {
    this.candidates = Array(9).fill().map(() => 
      Array(9).fill().map(() => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    );

    // Remove candidates based on initial board state
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          this.setCellValue(board, row, col, board[row][col]);
        }
      }
    }
  }

  // Set a cell value and update all related candidates
  setCellValue(board, row, col, value) {
    board[row][col] = value;
    this.candidates[row][col] = new Set();

    // Remove value from row candidates
    for (let c = 0; c < 9; c++) {
      this.candidates[row][c].delete(value);
    }

    // Remove value from column candidates
    for (let r = 0; r < 9; r++) {
      this.candidates[r][col].delete(value);
    }

    // Remove value from 3x3 box candidates
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        this.candidates[r][c].delete(value);
      }
    }
  }

  // Naked Singles: cells with only one candidate
  solveNakedSingles(board) {
    let progress = false;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0 && this.candidates[row][col].size === 1) {
          const value = Array.from(this.candidates[row][col])[0];
          this.setCellValue(board, row, col, value);
          this.solvingSteps.push({
            technique: 'Naked Single',
            row,
            col,
            value,
            reason: `Only possible value for cell (${row + 1}, ${col + 1})`
          });
          progress = true;
        }
      }
    }
    return progress;
  }

  // Hidden Singles: values that can only go in one cell in a unit
  solveHiddenSingles(board) {
    let progress = false;

    // Check rows
    for (let row = 0; row < 9; row++) {
      for (let value = 1; value <= 9; value++) {
        const possibleCols = [];
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0 && this.candidates[row][col].has(value)) {
            possibleCols.push(col);
          }
        }
        if (possibleCols.length === 1) {
          const col = possibleCols[0];
          this.setCellValue(board, row, col, value);
          this.solvingSteps.push({
            technique: 'Hidden Single (Row)',
            row,
            col,
            value,
            reason: `${value} can only go in this cell in row ${row + 1}`
          });
          progress = true;
        }
      }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      for (let value = 1; value <= 9; value++) {
        const possibleRows = [];
        for (let row = 0; row < 9; row++) {
          if (board[row][col] === 0 && this.candidates[row][col].has(value)) {
            possibleRows.push(row);
          }
        }
        if (possibleRows.length === 1) {
          const row = possibleRows[0];
          this.setCellValue(board, row, col, value);
          this.solvingSteps.push({
            technique: 'Hidden Single (Column)',
            row,
            col,
            value,
            reason: `${value} can only go in this cell in column ${col + 1}`
          });
          progress = true;
        }
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        for (let value = 1; value <= 9; value++) {
          const possibleCells = [];
          for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
            for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
              if (board[r][c] === 0 && this.candidates[r][c].has(value)) {
                possibleCells.push([r, c]);
              }
            }
          }
          if (possibleCells.length === 1) {
            const [row, col] = possibleCells[0];
            this.setCellValue(board, row, col, value);
            this.solvingSteps.push({
              technique: 'Hidden Single (Box)',
              row,
              col,
              value,
              reason: `${value} can only go in this cell in box ${boxRow + 1}-${boxCol + 1}`
            });
            progress = true;
          }
        }
      }
    }

    return progress;
  }

  // Pointing Pairs/Triples: eliminate candidates in intersecting units
  solvePointingPairs(board) {
    let progress = false;

    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        for (let value = 1; value <= 9; value++) {
          const cellsWithValue = [];
          
          // Find all cells in this box that can contain the value
          for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
            for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
              if (board[r][c] === 0 && this.candidates[r][c].has(value)) {
                cellsWithValue.push([r, c]);
              }
            }
          }

          if (cellsWithValue.length >= 2 && cellsWithValue.length <= 3) {
            // Check if all cells are in the same row
            const rows = new Set(cellsWithValue.map(([r, c]) => r));
            if (rows.size === 1) {
              const row = Array.from(rows)[0];
              // Remove value from other cells in this row outside the box
              for (let c = 0; c < 9; c++) {
                if (c < boxCol * 3 || c >= boxCol * 3 + 3) {
                  if (this.candidates[row][c].has(value)) {
                    this.candidates[row][c].delete(value);
                    progress = true;
                  }
                }
              }
            }

            // Check if all cells are in the same column
            const cols = new Set(cellsWithValue.map(([r, c]) => c));
            if (cols.size === 1) {
              const col = Array.from(cols)[0];
              // Remove value from other cells in this column outside the box
              for (let r = 0; r < 9; r++) {
                if (r < boxRow * 3 || r >= boxRow * 3 + 3) {
                  if (this.candidates[r][col].has(value)) {
                    this.candidates[r][col].delete(value);
                    progress = true;
                  }
                }
              }
            }
          }
        }
      }
    }

    return progress;
  }

  // Box/Line Reduction: eliminate candidates in boxes based on line constraints
  solveBoxLineReduction(board) {
    let progress = false;

    // Check each row
    for (let row = 0; row < 9; row++) {
      for (let value = 1; value <= 9; value++) {
        const boxesWithValue = new Set();
        
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0 && this.candidates[row][col].has(value)) {
            boxesWithValue.add(Math.floor(col / 3));
          }
        }

        if (boxesWithValue.size === 1) {
          const boxCol = Array.from(boxesWithValue)[0];
          const boxRow = Math.floor(row / 3);
          
          // Remove value from other cells in this box outside this row
          for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
            if (r !== row) {
              for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
                if (this.candidates[r][c].has(value)) {
                  this.candidates[r][c].delete(value);
                  progress = true;
                }
              }
            }
          }
        }
      }
    }

    // Check each column
    for (let col = 0; col < 9; col++) {
      for (let value = 1; value <= 9; value++) {
        const boxesWithValue = new Set();
        
        for (let row = 0; row < 9; row++) {
          if (board[row][col] === 0 && this.candidates[row][col].has(value)) {
            boxesWithValue.add(Math.floor(row / 3));
          }
        }

        if (boxesWithValue.size === 1) {
          const boxRow = Array.from(boxesWithValue)[0];
          const boxCol = Math.floor(col / 3);
          
          // Remove value from other cells in this box outside this column
          for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
            for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
              if (c !== col && this.candidates[r][c].has(value)) {
                this.candidates[r][c].delete(value);
                progress = true;
              }
            }
          }
        }
      }
    }

    return progress;
  }

  // Advanced constraint propagation
  constraintPropagation(board) {
    let progress = true;
    while (progress) {
      progress = false;
      progress |= this.solveNakedSingles(board);
      progress |= this.solveHiddenSingles(board);
      progress |= this.solvePointingPairs(board);
      progress |= this.solveBoxLineReduction(board);
    }
  }

  // Enhanced backtracking with constraint propagation
  solveWithBacktracking(board) {
    // Apply constraint propagation first
    this.constraintPropagation(board);

    // Find cell with minimum candidates (Most Constraining Variable heuristic)
    let minCandidates = 10;
    let bestCell = null;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const candidateCount = this.candidates[row][col].size;
          if (candidateCount === 0) {
            return false; // Invalid state
          }
          if (candidateCount < minCandidates) {
            minCandidates = candidateCount;
            bestCell = [row, col];
          }
        }
      }
    }

    if (!bestCell) {
      return true; // Solved
    }

    const [row, col] = bestCell;
    const candidateValues = Array.from(this.candidates[row][col]);

    // Try each candidate value
    for (const value of candidateValues) {
      // Save current state
      const boardCopy = this.copyBoard(board);
      const candidatesCopy = this.copyCandidates();

      // Make the move
      this.setCellValue(board, row, col, value);

      // Recursively solve
      if (this.solveWithBacktracking(board)) {
        return true;
      }

      // Backtrack: restore state
      this.restoreBoard(board, boardCopy);
      this.restoreCandidates(candidatesCopy);
    }

    return false;
  }

  // Main solving function
  solve(board) {
    this.solvingSteps = [];
    this.initializeCandidates(board);
    
    if (!this.isValidBoard(board)) {
      return { success: false, error: 'Invalid initial board state' };
    }

    const success = this.solveWithBacktracking(board);
    
    return {
      success,
      steps: this.solvingSteps,
      error: success ? null : 'No solution exists for this puzzle'
    };
  }

  // Validate board state
  isValidBoard(board) {
    // Check for invalid numbers
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col];
        if (value < 0 || value > 9) return false;
      }
    }

    // Check rows for duplicates
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
    
    // Check columns for duplicates
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
    
    // Check 3x3 boxes for duplicates
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

  // Check if puzzle is complete
  isComplete(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return false;
      }
    }
    return true;
  }

  // Get intelligent hint using constraint propagation
  getIntelligentHint(board) {
    const solver = new SudokuSolver();
    const boardCopy = this.copyBoard(board);
    
    solver.initializeCandidates(boardCopy);
    
    // Try to find a logical next step
    if (solver.solveNakedSingles(boardCopy)) {
      // Find the first cell that was filled
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0 && boardCopy[row][col] !== 0) {
            return {
              row,
              col,
              value: boardCopy[row][col],
              technique: 'Naked Single',
              explanation: `This cell can only contain ${boardCopy[row][col]}`
            };
          }
        }
      }
    }

    if (solver.solveHiddenSingles(boardCopy)) {
      // Find the first cell that was filled
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0 && boardCopy[row][col] !== 0) {
            return {
              row,
              col,
              value: boardCopy[row][col],
              technique: 'Hidden Single',
              explanation: `${boardCopy[row][col]} can only go in this position`
            };
          }
        }
      }
    }

    // Fallback: use backtracking to get any valid move
    const result = solver.solve(this.copyBoard(board));
    if (result.success) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            return {
              row,
              col,
              value: boardCopy[row][col],
              technique: 'Logical Deduction',
              explanation: `Next logical step`
            };
          }
        }
      }
    }

    return null;
  }

  // Utility functions
  copyBoard(board) {
    return board.map(row => [...row]);
  }

  copyCandidates() {
    return this.candidates.map(row => row.map(cell => new Set(cell)));
  }

  restoreBoard(board, backup) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        board[row][col] = backup[row][col];
      }
    }
  }

  restoreCandidates(backup) {
    this.candidates = backup;
  }

  // Analyze puzzle difficulty
  analyzeDifficulty(board) {
    const originalBoard = this.copyBoard(board);
    const solver = new SudokuSolver();
    const result = solver.solve(originalBoard);
    
    if (!result.success) {
      return { level: 'Invalid', score: 0 };
    }

    const filledCells = board.flat().filter(cell => cell !== 0).length;
    const techniques = new Set(result.steps.map(step => step.technique));
    
    let score = 0;
    if (techniques.has('Naked Single')) score += 1;
    if (techniques.has('Hidden Single')) score += 2;
    if (techniques.has('Pointing Pairs')) score += 3;
    if (techniques.has('Box/Line Reduction')) score += 3;
    
    // Adjust score based on filled cells
    score += Math.max(0, 30 - filledCells);

    if (score <= 5) return { level: 'Easy', score };
    if (score <= 15) return { level: 'Medium', score };
    if (score <= 25) return { level: 'Hard', score };
    return { level: 'Expert', score };
  }
}

// Legacy API compatibility functions
const globalSolver = new SudokuSolver();

function solveSudoku(board) {
  const result = globalSolver.solve(board);
  return result.success;
}

function isValidBoard(board) {
  return globalSolver.isValidBoard(board);
}

function getHint(board) {
  const hint = globalSolver.getIntelligentHint(board);
  return hint ? {
    row: hint.row,
    col: hint.col,
    value: hint.value
  } : null;
}

function copyBoard(board) {
  return globalSolver.copyBoard(board);
}

export {
  solveSudoku,
  isValidBoard,
  getHint,
  copyBoard,
  SudokuSolver
};
