import Decimal from "decimal.js";

export function calcFormula(leftOperand, rightOperand, operator) {
    const left = new Decimal(leftOperand);
    const right = new Decimal(rightOperand);
    let answer;
    if (operator === '+') answer = left.plus(right);
    if (operator === '-') answer = left.minus(right);
    if (operator === '*') answer = left.times(right);
    if (operator === '/') answer = left.dividedBy(right);
    return answer.toFixed();
}


export function numLength(num) {
    return num.replaceAll('.', '').length;
}