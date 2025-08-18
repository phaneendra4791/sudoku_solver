import React, { useState } from 'react';
import { solveSudoku, isValidBoard, getHint, copyBoard, SudokuSolver } from './solver';

// Create empty 9x9 board
const createEmptyBoard = () => {
  return Array(9).fill().map(() => Array(9).fill(0));
};

function App() {
  const [board, setBoard] = useState(createEmptyBoard);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [solvingSteps, setSolvingSteps] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [lastHint, setLastHint] = useState(null);

  // Handle cell input change
  const handleCellChange = (row, col, value) => {
    const newBoard = copyBoard(board);
    const numValue = parseInt(value) || 0;
    
    if (numValue >= 0 && numValue <= 9) {
      newBoard[row][col] = numValue;
      setBoard(newBoard);
      setError('');
      setLastHint(null);
      setSolvingSteps([]);
      setDifficulty(null);
    }
  };

  // Solve the Sudoku puzzle with advanced techniques
  const handleSolve = () => {
    setIsLoading(true);
    setError('');
    setSolvingSteps([]);
    
    const boardCopy = copyBoard(board);
    
    if (!isValidBoard(boardCopy)) {
      setError('Invalid Sudoku puzzle. Please check your input.');
      setIsLoading(false);
      return;
    }

    // Use the advanced solver
    try {
      const solver = new SudokuSolver();
      const result = solver.solve(boardCopy);
      
      if (result.success) {
        setBoard(boardCopy);
        setSolvingSteps(result.steps);
        const difficultyAnalysis = solver.analyzeDifficulty(board);
        setDifficulty(difficultyAnalysis);
      } else {
        setError(result.error || 'This Sudoku puzzle has no solution.');
      }
    } catch (err) {
      // Fallback to basic solver
      if (solveSudoku(boardCopy)) {
        setBoard(boardCopy);
      } else {
        setError('This Sudoku puzzle has no solution.');
      }
    }
    
    setIsLoading(false);
  };

  // Clear the board
  const handleClear = () => {
    setBoard(createEmptyBoard());
    setError('');
    setSolvingSteps([]);
    setDifficulty(null);
    setLastHint(null);
  };

  // Get an intelligent hint
  const handleHint = () => {
    setError('');
    
    try {
      const solver = new SudokuSolver();
      const hint = solver.getIntelligentHint(board);
      
      if (hint) {
        const newBoard = copyBoard(board);
        newBoard[hint.row][hint.col] = hint.value;
        setBoard(newBoard);
        setLastHint({
          ...hint,
          cellId: `${hint.row}-${hint.col}`
        });
      } else {
        setError('No hints available. The puzzle might be complete or unsolvable.');
      }
    } catch (err) {
      // Fallback to basic hint
      const hint = getHint(board);
      if (hint) {
        const newBoard = copyBoard(board);
        newBoard[hint.row][hint.col] = hint.value;
        setBoard(newBoard);
        setLastHint({
          row: hint.row,
          col: hint.col,
          value: hint.value,
          technique: 'Basic Hint',
          explanation: 'Next logical step',
          cellId: `${hint.row}-${hint.col}`
        });
      } else {
        setError('No hints available. The puzzle might be complete or unsolvable.');
      }
    }
  };

  // Analyze current puzzle difficulty
  const handleAnalyze = () => {
    try {
      const solver = new SudokuSolver();
      const analysis = solver.analyzeDifficulty(board);
      setDifficulty(analysis);
    } catch (err) {
      setError('Unable to analyze puzzle difficulty.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sudoku Solver</h1>
          <p className="text-gray-600">Enter numbers 1-9 and let the algorithm solve it for you!</p>
        </div>


        {/* Sudoku Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-9 gap-1 w-full max-w-md mx-auto aspect-square">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  className={`
                    w-full aspect-square text-center text-lg font-semibold
                    border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${getBorderClasses(rowIndex, colIndex)}
                    ${cell === 0 ? 'bg-gray-50 text-gray-700' : 'bg-blue-50 text-blue-800'}
                    hover:bg-blue-100 transition-colors
                  `}
                  maxLength="1"
                  inputMode="numeric"
                />
              ))
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleSolve}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Solving...
              </>
            ) : (
              'Solve'
            )}
          </button>

          <button
            onClick={handleHint}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
          >
            Hint
          </button>

          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Enter numbers 1-9 in the empty cells
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Click "Solve" to automatically complete the puzzle
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              Use "Hint" to fill one correct cell
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              "Clear" resets the entire board
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper function to get border classes for 3x3 box visualization
function getBorderClasses(row, col) {
  let classes = 'border-gray-300';
  
  // Thicker borders for 3x3 box separation
  if (row % 3 === 0 && row !== 0) classes += ' border-t-4 border-t-gray-600';
  if (col % 3 === 0 && col !== 0) classes += ' border-l-4 border-l-gray-600';
  if (row === 8) classes += ' border-b-4 border-b-gray-600';
  if (col === 8) classes += ' border-r-4 border-r-gray-600';
  if (row === 0) classes += ' border-t-4 border-t-gray-600';
  if (col === 0) classes += ' border-l-4 border-l-gray-600';
  
  return classes;
}

export default App;
