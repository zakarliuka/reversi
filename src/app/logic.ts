import { Point } from "./app.component";

const ScoreCoefs: number[][] = [
  [16.16, -3.03, 0.99, 0.43, 0.43, 0.99, -3.03, 16.16],
  [-4.12, -1.81, -0.08, -0.27, -0.27, -0.08, -1.81, -4.12],
  [1.13, -0.04, 0.51, 0.07, 0.07, 0.51, -0.04, 1.13],
  [0.63, -0.18, -0.04, -0.01, -0.01, -0.04, -0.18, 0.63],
  [0.63, -0.18, -0.04, -0.01, -0.01, -0.04, -0.18, 0.63],
  [1.13, -0.04, 0.51, 0.07, 0.07, 0.51, -0.04, 1.13],
  [-4.12, -1.81, -0.08, -0.27, -0.27, -0.08, -1.81, -4.12],
  [16.16, -3.03, 0.99, 0.43, 0.43, 0.99, -3.03, 16.16]
];

function checkLineMatch(
  who: -1 | 1,
  dr: number,
  dc: number,
  r: number,
  c: number,
  board: number[][]
): boolean {
  if (board[r][c] === who) {
    return true;
  }
  if (board[r][c] === 0) {
    return false;
  }
  if (r + dr < 0 || r + dr > 7) {
    return false;
  }
  if (c + dc < 0 || c + dc > 7) {
    return false;
  }

  return checkLineMatch(who, dr, dc, r + dr, c + dc, board);
}

function validMove(
  who: -1 | 1,
  dr: number,
  dc: number,
  r: number,
  c: number,
  board: number[][]
): boolean {
  let other = -who;

  if (r + dr < 0 || r + dr > 7 || c + dc < 0 || c + dc > 7) {
    return false;
  }

  if (board[r + dr][c + dc] !== other) {
    return false;
  }

  if (
    r + dr + dr < 0 ||
    r + dr + dr > 7 ||
    c + dc + dc < 0 ||
    c + dc + dc > 7
  ) {
    return false;
  }

  return checkLineMatch(who, dr, dc, r + dr + dr, c + dc + dc, board);
}

function calcValidMoves(who: -1 | 1, board: number[][]): number[][] {
  let valid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 0) {
        let nw = validMove(who, -1, -1, row, col, board);
        let nn = validMove(who, -1, 0, row, col, board);
        let ne = validMove(who, -1, 1, row, col, board);

        let ww = validMove(who, 0, -1, row, col, board);
        let ee = validMove(who, 0, 1, row, col, board);

        let sw = validMove(who, 1, -1, row, col, board);
        let ss = validMove(who, 1, 0, row, col, board);
        let se = validMove(who, 1, 1, row, col, board);

        if (nw || nn || ne || ww || ee || sw || ss || se) {
          valid[row][col] = who;
        }
      }
    }
  }

  return valid;
}

export function isFieldValid(
  who: -1 | 1,
  board: number[][],
  pos: Point
): boolean {
  const validBoard = calcValidMoves(who, board);
  return validBoard[pos.x][pos.y] === who;
}

function flipLine(
  who: -1 | 1,
  dr: number,
  dc: number,
  r: number,
  c: number,
  board: number[][]
): boolean {
  if (r + dr < 0 || r + dr > 7 || c + dc < 0 || c + dc > 7) {
    return false;
  }

  if (board[r + dr][c + dc] === 0) {
    return false;
  }

  if (board[r + dr][c + dc] === who) {
    return true;
  } else {
    if (flipLine(who, dr, dc, r + dr, c + dc, board)) {
      board[r + dr][c + dc] = who;
      return true;
    }
    return false;
  }
}

export function flipBoard(
  who: -1 | 1,
  row: number,
  col: number,
  board: number[][]
): number[][] {
  let flippedBoard: number[][] = [...board];

  flipLine(who, -1, -1, row, col, flippedBoard);
  flipLine(who, -1, 0, row, col, flippedBoard);
  flipLine(who, -1, 1, row, col, flippedBoard);
  flipLine(who, 0, -1, row, col, flippedBoard);
  flipLine(who, 1, 1, row, col, flippedBoard);
  flipLine(who, 0, 1, row, col, flippedBoard);
  flipLine(who, 1, -1, row, col, flippedBoard);
  flipLine(who, 1, 0, row, col, flippedBoard);
  return flippedBoard;
}

/*
 * return black, white score
 */
export function getScore(board: number[][]): [number, number] {
  let black = 0,
    white = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell === 1) {
        white++;
      }
      if (cell === -1) {
        black++;
      }
    }
  }
  return [black, white];
}

function countScore(who: -1 | 1, board: number[][]): number {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === who) {
        score += board[row][col] + ScoreCoefs[row][col];
      }
    }
  }
  return score;
}

function minimax(
  who: -1 | 1,
  depth: number,
  alpha: number,
  beta: number,
  isMaximazing: boolean,
  board: number[][]
) {
  if (depth === 0 || isGameOver(who, board)) {
    return countScore(who, board);
  }

  let bestScore: number;
  if (isMaximazing) {
    bestScore = -Infinity;
    const validMoves: number[][] = calcValidMoves(who, board);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        //Is the spot available?
        if (validMoves[i][j] !== 0) {
          let newboard = board.map(arr => arr.slice());

          newboard[i][j] = who;
          newboard = flipBoard(who, i, j, newboard);

          let score = minimax(who, depth - 1, alpha, beta, false, newboard);

          bestScore = Math.max(score, bestScore);
          alpha = Math.max(alpha, score);

          if (alpha <= beta) {
            break;
          }
        }
      }
    }
    return bestScore;
  } else {
    bestScore = Infinity;
    const validMoves: number[][] = calcValidMoves((who * -1) as -1 | 1, board);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        //Is the spot available?
        if (validMoves[i][j] !== 0) {
          let newboard = board.map(arr => arr.slice());

          newboard[i][j] = -who;
          newboard = flipBoard(-who as -1 | 1, i, j, newboard);

          let score = minimax(who, depth - 1, alpha, beta, true, board);

          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, score);

          if (beta <= alpha) {
            break;
          }
        }
      }
    }
  }
  return bestScore;
}

export function bestMove(who: -1 | 1, depth: number, board: number[][]): Point {
  let bestScore = -Infinity;
  let bestMove: Point;

  let validMoves: number[][] = calcValidMoves(who, board);
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //Is the spot available?
      if (validMoves[i][j] !== 0) {
        let newboard = board.map(arr => arr.slice());

        newboard[i][j] = who;
        newboard = flipBoard(who, i, j, newboard);

        let score = minimax(who, depth, -Infinity, Infinity, false, newboard);

        if (score > bestScore) {
          bestScore = score;
          bestMove = { x: i, y: j };
        }
      }
    }
  }

  return bestMove;
}

export function isGameOver(who: -1 | 1, board: number[][]): boolean {
  let count = 0;

  const validMoves: number[][] = calcValidMoves(who, board);

  for (let row of validMoves) {
    for (let col of row) {
      if (col !== 0) {
        count++;
      }
    }
  }
  return count === 0;
}
