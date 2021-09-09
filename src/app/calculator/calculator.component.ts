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
  output: Fraction = Fraction.parseNumber(0);
  outputDisplay: string = "0 + ";
  operator: Operators = Operators.Add;
  history: string[] = []
  isOperator: boolean = false;
  decimalSeparator: string = ".";

  constructor() { }

  ngOnInit(): void {
    this.onClear();
  }


  onClear(): void {
    this.input = "0";
    this.output = Fraction.parseNumber(0);
    this.operator = Operators.Add;
    this.updateDisplay();
    this.history = [];
    this.isOperator = false;
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
    var input = Fraction.parseNumber(Number.parseFloat(this.input));
    var tmp = this.output;

    switch(this.operator) {
      case Operators.Add:
        this.output = this.output.add(input);
        this.history.push(this.formatCalculation(tmp, input, Operators.Add, this.output));
        break;
      case Operators.Divide:
        if(input.numerator == 0) {
          this.outputDisplay = "Can't divide by zero";
          return;
        }
        this.output = this.output.divide(input);
        this.history.push(this.formatCalculation(tmp, input, Operators.Divide, this.output));
        break;
      case Operators.Multiply:
        this.output = this.output.multiply(input);
        this.history.push(this.formatCalculation(tmp, input, Operators.Multiply, this.output));
        break;
      case Operators.Subtract: 
        this.output = this.output.subtract(input);
        this.history.push(this.formatCalculation(tmp, input, Operators.Subtract, this.output));
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
    this.outputDisplay = `${this.output.toNumber()} ${this.operator}`;
  }

  formatCalculation(first: Fraction, second: Fraction, operator: Operators, result: Fraction): string {
    return `${first.toNumber()} ${operator} ${second.toNumber()} = ${result.toNumber()}`;
  }
}

enum Operators {
  Add = "+",
  Subtract = "-",
  Multiply = "x",
  Divide = "/"
}

class Fraction {
  numerator: number = 0;
  denominator: number = 0;

  private constructor(numerator: number, denominator: number) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  add(other: Fraction): Fraction {
    var numerator = (this.numerator * other.denominator) + (other.numerator * this.denominator);
    var denominator = this.denominator * other.denominator;

    return new Fraction(numerator, denominator).simplify();
  }

  subtract(other: Fraction): Fraction {
    var numerator = (this.numerator * other.denominator) - (other.numerator * this.denominator);
    var denominator = this.denominator * other.denominator;

    return new Fraction(numerator, denominator).simplify();
  }

  multiply(other: Fraction): Fraction {
    var numerator = this.numerator * other.numerator;
    var denominator = this.denominator * other.denominator;

    return new Fraction(numerator, denominator).simplify();
  }

  divide(other: Fraction): Fraction {
    var numerator = this.numerator * other.denominator;
    var denominator = this.denominator * other.numerator;
    return new Fraction(numerator, denominator).simplify();
  }

  toNumber(): number {
    //console.log(`${this.numerator}/${this.denominator}`);
    return this.numerator / this.denominator;
  }

  static parseNumber(number: number): Fraction {
    var decimal = number.toString().indexOf('.') + 1;
    var exp = decimal > 0 ? number.toString().substring(decimal).length : 0;
    var denominator = 10 ** exp;
    var numerator = Number.parseInt(number.toString()) * denominator 
      + Number.parseInt(decimal > 0 ? number.toString().substring(decimal) : "0");
    //console.log(`${numerator}/${denominator}`);
    return new Fraction(numerator, denominator).simplify();
  }

  greatestCommonFactor(): number {
    var numerator = this.numerator < 0 ? this.numerator * -1 : this.numerator;
    for(var i = numerator < this.denominator? numerator : this.denominator; i >= 0; i--) {
      if(numerator % i == 0 && this.denominator % i == 0) return i;
    }

    return -1;
  }

  simplify(): Fraction {
    var gcf = this.greatestCommonFactor();
    var numerator = this.numerator / gcf;
    var denominator = this.denominator / gcf;

    return new Fraction(numerator, denominator);
  }
}
