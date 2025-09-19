import Decimal from "decimal.js";
import { Operator } from "./types";

export function calcFormula(leftOperand: string, rightOperand: string, operator: Operator): string {
    const left = new Decimal(leftOperand);
    const right = new Decimal(rightOperand);

    let answer = calcDecimalFormula(left, right, operator);
    return answer.toFixed();
}

function calcDecimalFormula(leftOperand: Decimal, rightOperand: Decimal, operator: Operator): Decimal {
    if (operator === '+') return leftOperand.plus(rightOperand);
    if (operator === '-') return leftOperand.minus(rightOperand);
    if (operator === '*') return leftOperand.times(rightOperand);
    if (operator === '/') return leftOperand.dividedBy(rightOperand);
    throw new Error('runtime error calcDecimalFormula');
}


export function numLength(num: string): number {
    return num.replaceAll('.', '').length;
}