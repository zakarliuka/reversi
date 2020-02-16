import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"]
})
export class CellComponent implements OnInit {
  @Input() isActive: number = 0;
  @Input() isValidField: boolean;
  @Input() color: boolean = false;

  constructor() {}

  ngOnInit() {}
}
