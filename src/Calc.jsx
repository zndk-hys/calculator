import { useReducer } from 'react';

function calcFormula(leftOperand, rightOperand, operator) {
    const left = Number(leftOperand);
    const right = Number(rightOperand);
    let answer = 0;
    if (operator === '+') answer = left + right;
    if (operator === '-') answer = left - right;
    if (operator === '*') answer = left * right;
    if (operator === '/') answer = left / right;
    return String(answer);
}

function calcReducer(state, action) {
    if (action.type === 'numKey') {
        let newVal;
        if (state.operandRight === null || state.operandRight === '0') {
            newVal = String(action.payload.num);
        } else {
            newVal = state.operandRight + String(action.payload.num);
        }
        return {
            ...state,
            operandRight: newVal,
            display: newVal,
        }
    } else if (action.type === 'clearKey') {
        return {
            operandLeft: null,
            operandRight: null,
            display: '0',
        };
    } else if (action.type === 'operatorKey') {
        const operator = action.payload.kind;

        if ( state.operandLeft !== null && state.operator !== null ) {
            const result = calcFormula(state.operandLeft, state.operandRight, state.operator);
            return {
                ...state,
                display: result,
                operandLeft: result,
                operandRight: null,
                operator: operator,
            }
        }

        return {
            ...state,
            operator,
            operandLeft: state.operandRight || state.operandLeft,
            operandRight: null,
        };
    } else if (action.type === 'equalKey') {
        if ( state.operandLeft !== null && state.operator !== null ) {
            const result = calcFormula(state.operandLeft, state.operandRight, state.operator);
            return {
                ...state,
                display: result,
                operandLeft: result,
                operandRight: null,
                operator: null,
            }
        }
    } else if (action.type === 'dotKey') {
        let newVal;
        if (state.operandRight === null) {
            newVal = '0.';
        } else if( state.operandRight.indexOf('.') >= 0) {
            newVal = state.operandRight;
        } else {
            newVal = state.operandRight + '.';
        }
        return {
            ...state,
            operandRight: newVal,
            display: newVal,
        }
    }
    return state;
}

export default function Calc() {
    const [state, dispatch] = useReducer(calcReducer, {
        display: '0',
        operandLeft: null,
        operandRight: null,
        operator: null,
    });

    const handleNumKey = e => {
        dispatch({
            type: 'numKey',
            payload: {
                num: e.target.value,
            }
        })
    }

    const handleClearKey = e => {
        dispatch({
            type: 'clearKey',
        })
    }

    const handleOperatorKey = e => {
        dispatch({
            type: 'operatorKey',
            payload: {
                kind: e.target.value,
            }
        });
    }

    const handleEqualKey = e => {
        dispatch({
            type: 'equalKey',
        });
    }

    const handleDotKey = e => {
        dispatch({
            type: 'dotKey',
        });
    }
    
    return (
        <div>
            <p>
                <input type="text" value={state.display} />
            </p>
            <input type="button" value="0" onClick={handleNumKey} />
            <input type="button" value="1" onClick={handleNumKey} />
            <input type="button" value="2" onClick={handleNumKey} />
            <input type="button" value="3" onClick={handleNumKey} />
            <input type="button" value="4" onClick={handleNumKey} />
            <input type="button" value="5" onClick={handleNumKey} />
            <input type="button" value="6" onClick={handleNumKey} />
            <input type="button" value="7" onClick={handleNumKey} />
            <input type="button" value="8" onClick={handleNumKey} />
            <input type="button" value="9" onClick={handleNumKey} />
            <input type="button" value="C" onClick={handleClearKey} /><br />
            <input type="button" value="." onClick={handleDotKey} /><br />
            <input type="button" value="+" onClick={handleOperatorKey} />
            <input type="button" value="-" onClick={handleOperatorKey} />
            <input type="button" value="*" onClick={handleOperatorKey} />
            <input type="button" value="/" onClick={handleOperatorKey} /><br />
            <input type="button" value="=" onClick={handleEqualKey} /><br />
            <div>
                display: {state.display}<br />
                operandLeft: {state.operandLeft}<br />
                operandRight: {state.operandRight}<br />
                operator: {state.operator}
            </div>
        </div>
    );
}