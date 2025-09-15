export function calcFormula(leftOperand, rightOperand, operator) {
    const left = Number(leftOperand);
    const right = Number(rightOperand);
    let answer = 0;
    if (operator === '+') answer = left + right;
    if (operator === '-') answer = left - right;
    if (operator === '*') answer = left * right;
    if (operator === '/') {
        if ( right === 0 ) {
            throw new Error('zero');
        }
        answer = left / right;
    }
    return String(answer);
}