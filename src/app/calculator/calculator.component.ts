import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  buttons: number[] = [7, 8, 9, 4, 5, 6, 1, 2, 3];
  operators: string[] = ["x", "/", "+", "-"];
  input: string = "0";
  output: number = 0;
  outputDisplay: string = "0 + ";
  operator: Operators = Operators.Add;
  history: string[] = []
  isOperator: boolean = true;
  decimalSeparator: string = ".";

  constructor() { }

  ngOnInit(): void {
    this.onClear();
  }


  onClear(): void {
    this.input = "0";
    this.output = 0;
    this.operator = Operators.Add;
    this.updateDisplay();
    this.history = [];
    this.isOperator = true;
  }

  onNumber(input: number): void {
    if(this.input.length == 1 && this.input[0] == '0') {
      this.input = input.toString();
      return;
    } else { 
      this.input += input; 
    }
    this.isOperator = false;
  }

  onDecimal(): void {
    if(this.input.length > 0 && !this.input.includes(this.decimalSeparator))
      this.input += this.decimalSeparator;

    this.isOperator = false;
  }

  onOperator(operator: string): void {
    if(!this.isOperator) this.onEquals();

    //this.operator = Operators[operator as keyof typeof Operators];
    switch(operator) {
      case "+": this.operator = Operators.Add; break;
      case "-": this.operator = Operators.Subtract; break;
      case "x": this.operator = Operators.Multiply; break;
      case "/": this.operator = Operators.Divide; break;
    }
    this.isOperator = true;

    this.updateDisplay();
  }

  onEquals(): void {
    var input = Number.parseFloat(this.input);
    var tmp = this.output;

    switch(this.operator) {
      case Operators.Add:
        this.output += input;
        this.history.push(`${tmp} + ${input} = ${this.output}`);
        break;
      case Operators.Divide:
        if(input == 0) {
          this.outputDisplay = "Can't divide by zero";
          return;
        }
        this.output /= input;
        this.history.push(`${tmp} / ${input} = ${this.output}`);
        break;
      case Operators.Multiply:
        this.output *= input; 
        this.history.push(`${tmp} x ${input} = ${this.output}`);
        break;
      case Operators.Subtract: 
        this.output -= input;
        this.history.push(`${tmp} - ${input} = ${this.output}`);
        break;
    }
    this.input = "0";
    this.updateDisplay();
    this.isOperator = true;
  }

  onDelete(): void {
    this.input = this.input.substring(0, this.input.length-1);

    if(this.input.length == 0)
      this.input = "0";

    this.isOperator = false;
  }

  updateDisplay(): void {
    this.outputDisplay = `${this.output} ${this.operator}`;
  }
}

enum Operators {
  Add = "+",
  Subtract = "-",
  Multiply = "x",
  Divide = "/"
}
