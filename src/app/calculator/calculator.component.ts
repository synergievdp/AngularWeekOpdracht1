import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  buttons: number[] = [7, 8, 9, 4, 5, 6, 1, 2, 3]
  operators: string[] = ["x", "/", "+", "-"]
  constructor() { }

  ngOnInit(): void {
  }

}
