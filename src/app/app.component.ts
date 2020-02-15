import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { isFieldValid, flipBoard, getScore, isGameOver } from "./logic";

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
  player = -1;
  ai = 1;

  cur: -1 | 1 = -1;

  board: number[][];

  score: [number, number] = [0, 0];

  isGameOver = true;

  initPlayer = new FormGroup({
    player: new FormControl(-1)
  });

  ngOnInit(): void {
    this.initGame();
  }

  initGame() {
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
    this.cur = -1;
    this.score = [0, 0];
  }

  startGame() {
    this.player = +this.initPlayer.value["player"];
    this.ai = this.player * -1;
    this.isGameOver = !this.isGameOver;
    this.initPlayer.reset();
    this.initGame();
  }

  newGame() {
    this.isGameOver = !this.isGameOver;
    this.player = 1;
    this.ai = -1;
  }

  onClickCell(pos: Point) {
    if (isFieldValid(this.cur, this.board, pos) && !this.isGameOver) {
      this.board[pos.x][pos.y] = this.cur;

      this.board = flipBoard(this.cur, pos.x, pos.y, this.board);

      this.score = getScore(this.board);

      this.cur = -this.cur as -1 | 1;
    }

    this.isGameOver = isGameOver(this.cur, this.board);
  }

  get names(): [string, string] {
    if (this.player === -1) {
      return ["Player", "AI"];
    }
    return ["AI", "Player"];
  }
}
