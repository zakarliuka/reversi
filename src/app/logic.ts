import { Point } from "./app.component";

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

function minimax(
  who: -1 | 1,
  depth: number,
  isMaximazing: boolean,
  board: number[][]
) {
  let currentScore: [number, number] = getScore(board);
  if (depth === 0 || isGameOver(who, board)) {
    return currentScore[who === -1 ? 0 : 1];
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

          let score = minimax(who, depth - 1, false, newboard);

          bestScore = Math.max(score, bestScore);
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

          let score = minimax(who, depth - 1, true, board);

          bestScore = Math.min(score, bestScore);
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

        let score = minimax(who, depth, false, newboard);

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
