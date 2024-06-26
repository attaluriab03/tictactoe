import {useState} from "react";

function Square({value, onSquareClick}) {
  
  // feature 1: adding different colors for X and O
  let squareStyle = "square";
  if (value === "X") {
    squareStyle += " , X-square";
  }
  else {
    squareStyle += " , O-square";
  }

  return (
    // onClick is a special built-in React component
    <button className={squareStyle} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  
  function handleClick(i) {
    /* first check if the square already has a value 
    -> this is to ensure we don't replace an existing square */
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    /* creating copy of squares array using slice() method
    -> creating a copy is instead of modifying directly is desired for immutability because
    immutability allows us to see past version of array, so we can see each move */
    const nextSquares = squares.slice();
    // updating nextSquares array
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    // letting React know state of component has changed
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  else {
    // this statement does the same as the if/else above in handleClick()
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  // Additional Feature: function to print squares using loops instead of hardcoding them
  const renderSquare = (i) => {
    return (
      <Square value={squares[i]} onSquareClick={()=>handleClick(i)} /> 
    );
  };

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      squaresInRow.push(renderSquare(row * 3 + col));
    }
    boardRows.push(<div key={row} className="board-row">{squaresInRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
  
}

// the keywords export default tell index.js that this is the top-level component
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move # " + move;
    }
    else {
      description = "Go to game start";
    }
    return (
      <li key={move}> 
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  return (
    <div className="game"> 
      <div className="game-board"> 
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info"> 
        <ol> {moves} </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

  /* Line: const [history, setHistory] = useState([Array(9).fill(null)]);
  creating a shared state in the default (parent) component so that the 
  child components (different squares) can interact with each other 
  -> parent passes the data down the children via props. this is called lifting state up.
  The Array(9).fill(null) creates an array containing the values of the board -> when 
  a board is clicked, the array will contain the X or O that was clicked there. 
  This line also stores the history. */

  