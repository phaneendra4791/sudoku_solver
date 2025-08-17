# Sudoku Solver

A modern, responsive Sudoku solver built with React and TailwindCSS. Features a clean interface with instant solving using backtracking algorithm.

## Features

- **9x9 Interactive Grid**: Click and type numbers 1-9
- **Instant Solver**: Uses backtracking algorithm for guaranteed correct solutions
- **Hint System**: Get one correct cell filled at a time
- **Input Validation**: Detects invalid or unsolvable puzzles
- **Responsive Design**: Works perfectly on mobile and desktop
- **Modern UI**: Clean, minimal design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## How to Use

1. **Enter Numbers**: Click on any cell and type a number (1-9)
2. **Solve**: Click the "Solve" button to automatically complete the puzzle
3. **Get Hints**: Use the "Hint" button to fill one correct cell
4. **Clear Board**: Reset the entire grid with the "Clear" button

## Project Structure

```
src/
├── App.jsx          # Main React component with UI logic
├── solver.js        # Sudoku solving algorithm (backtracking)
├── main.jsx         # React app entry point
└── index.css        # TailwindCSS styles
```

## Algorithm

The solver uses a **backtracking algorithm**:

1. Find an empty cell
2. Try numbers 1-9 in that cell
3. Check if the number is valid (row, column, 3x3 box rules)
4. If valid, recursively solve the rest
5. If no solution found, backtrack and try the next number

## Technologies Used

- **React 18** - UI framework
- **TailwindCSS** - Styling and responsive design
- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - Solving algorithm

## License

MIT License - feel free to use this project for learning or personal use.
