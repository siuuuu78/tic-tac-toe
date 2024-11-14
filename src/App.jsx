import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
    <Button 
      variant="outlined" 
      onClick={onSquareClick} 
      sx={{
        width: 80, 
        height: 80, 
        fontSize: '2rem', 
        fontWeight: 'bold',
        borderColor: '#333',
        color: value ? '#333' : '#666',
        ':hover': {
          backgroundColor: '#f4f4f9',
        },
      }}
    >
      {value}
    </Button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Pemenang: ${winner}` : `Pemain selanjutnya: ${xIsNext ? 'X' : 'O'}`;

  return (
    <Box sx={{ textAlign: 'center', my: 2 }}>
      <Typography variant="h5" gutterBottom>{status}</Typography>
      <Grid container spacing={1} justifyContent="center">
        {[0, 1, 2].map(row => (
          <Grid key={row} container item spacing={1} xs={12} justifyContent="center">
            {[0, 1, 2].map(col => (
              <Grid item key={col}>
                <Square 
                  value={squares[row * 3 + col]} 
                  onSquareClick={() => handleClick(row * 3 + col)} 
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

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

  const moves = history.map((_, move) => (
    <li key={move}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => jumpTo(move)} 
        sx={{ marginY: 0.5 }}
      >
        {move > 0 ? `Pergi ke langkah #${move}` : 'Pergi ke awal permainan'}
      </Button>
    </li>
  ));

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" p={3}>
      <Box>
      <Typography textAlign="center" variant="h4" gutterBottom>Tic Tac Toe</Typography>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </Box>
      <Box sx={{ marginLeft: 3 }}>
        <Typography variant="h6" gutterBottom>Riwayat Langkah</Typography>
        <ol style={{ padding: 0, listStyle: 'none' }}>{moves}</ol>
      </Box>
    </Box>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
