import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  isFieldValid,
  flipBoard,
  getScore,
  isGameOver,
  bestMove,
  calcValidMoves
} from "./logic";

export interface Point {
  x: number;
  y: number;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  player: -1 | 1 = -1;
  ai: -1 | 1 = 1;

  depth: number = 2;

  cur: -1 | 1 = -1;

  board: number[][];

  validMoves: number[][];

  score: [number, number] = [0, 0];

  isGameOver = true;

  initPlayer = new FormGroup({
    player: new FormControl(),
    depth: new FormControl(2)
  });

  ngOnInit(): void {
    this.initGame();
  }

  initGame() {
    this.cur = -1;
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, -1, 0, 0, 0],
      [0, 0, 0, -1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    this.validMoves = calcValidMoves(this.player, this.board);
    this.score = [2, 2];
  }

  startGame() {
    this.player = +this.initPlayer.value["player"] as -1 | 1;
    this.ai = (this.player * -1) as -1 | 1;
    this.isGameOver = !this.isGameOver;
    this.depth = Math.max(+this.initPlayer.value["depth"], 2);
    this.initPlayer.reset();
    this.initGame();
    this.aiMove();
  }

  newGame() {
    this.isGameOver = !this.isGameOver;
    this.player = 1;
    this.ai = -1;
  }

  aiMove(): void {
    this.isGameOver = isGameOver(this.cur, this.board);
    if (this.cur === this.ai) {
      let ai_pos: Point = bestMove(this.ai, this.depth, this.board);

      if (ai_pos) {
        this.board[ai_pos.x][ai_pos.y] = this.ai;
        this.board = flipBoard(this.cur, ai_pos.x, ai_pos.y, this.board);

        this.score = getScore(this.board);
        this.cur = -this.cur as -1 | 1;

        this.validMoves = calcValidMoves(this.player, this.board);
      } else {
        this.isGameOver = !this.isGameOver;
      }
    }
  }
  onClickCell(pos: Point) {
    this.isGameOver = isGameOver(this.cur, this.board);
    if (isFieldValid(this.cur, this.board, pos) && !this.isGameOver) {
      this.board[pos.x][pos.y] = this.cur;

      this.board = flipBoard(this.cur, pos.x, pos.y, this.board);

      this.score = getScore(this.board);

      this.cur = -this.cur as -1 | 1;
    }
    this.aiMove();
    this.isGameOver = isGameOver(this.cur, this.board);
  }

  get names(): [string, string] {
    if (this.player === -1) {
      return ["Player", "AI"];
    }
    return ["AI", "Player"];
  }
}
