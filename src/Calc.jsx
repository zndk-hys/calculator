import { useReducer } from 'react';

function calcFormula(leftOperand, rightOperand, operator) {
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

function calcReducer(state, action) {
    if (action.type === 'numKey') {
        const inputNum = String(action.payload.num);
        
        if (state.state === 'init' || state.state === 'pend_right' || state.state === 'result' || state.state === 'error' ) {
            return {
                ...state,
                state: 'input_int',
                operandRight: inputNum,
                display: inputNum,
            };
        }

        if (state.state === 'input_int' || state.state === 'input_frac') {
            const newVal = state.operandRight === '0' ? inputNum : state.operandRight + inputNum;
            return {
                ...state,
                operandRight: newVal,
                display: newVal,
            };
        }

    } else if (action.type === 'clearKey') {
        return {
            state: 'init',
            operandLeft: null,
            operandRight: null,
            display: '0',
            operator: null,
        };
    } else if (action.type === 'operatorKey') {
        const operator = action.payload.kind;

        if (state.state === 'init' || state.state === 'error' ) {
            return {
                ...state,
                state: 'pend_right',
                operandLeft: '0',
                operandRight: null,
                operator,
            }
        }

        if (state.state === 'result') {
            return {
                ...state,
                state: 'pend_right',
                operandLeft: state.operandRight,
                operator,
            }
        }

        if (state.state === 'input_int' || state.state === 'input_frac') {
            let newOperandLeft = state.operandRight;
            let newDisplay = state.operandRight;
            if ( state.operandLeft && state.operator ) {
                try {
                    newOperandLeft = calcFormula(state.operandLeft, state.operandRight, state.operator);
                } catch {
                    return {
                        ...state,
                        state: 'error',
                        display: 'error',
                        operandLeft: null,
                        operandRight: null,
                        operator: null,
                    }
                }

                newDisplay = newOperandLeft;
            }
            return {
                ...state,
                state: 'pend_right',
                display: newDisplay,
                operandLeft: newOperandLeft,
                operandRight: null,
                operator,
            }
        }

        if (state.state === 'pend_right') {
            return {
                ...state,
                operator,
            }
        }

    } else if (action.type === 'equalKey') {
        if (state.state === 'input_int' || state.state === 'input_frac') {
            if ( state.operandLeft && state.operator ) {
                try {
                    const result = calcFormula(state.operandLeft, state.operandRight, state.operator);

                    return {
                        ...state,
                        state: 'result',
                        display: result,
                        operandLeft: null,
                        operandRight: result,
                        operator:  null,
                    }
                } catch {
                    return {
                        ...state,
                        state: 'error',
                        display: 'error',
                        operandLeft: null,
                        operandRight: null,
                        operator: null,
                    }
                }
            }
        }
        
    } else if (action.type === 'dotKey') {
        if (state.state === 'init' || state.state === 'pend_right' || state.state === 'result' || state.state === 'error' ) {
            return {
                ...state,
                state: 'input_frac',
                operandRight: '0.',
                display: '0.',
            };
        }

        if (state.state === 'input_int') {
            return {
                ...state,
                state: 'input_frac',
                operandRight: state.operandRight + '.',
                display: state.operandRight + '.',
            };
        }

        if (state.state === 'input_frac') {
            return state;
        }
    }
    return state;
}

export default function Calc() {
    const [state, dispatch] = useReducer(calcReducer, {
        state: 'init', // init | intput_int | input_frac | pend_right | result | error
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
                state: {state.state}<br />
                display: {state.display}<br />
                operandLeft: {state.operandLeft}<br />
                operandRight: {state.operandRight}<br />
                operator: {state.operator}
            </div>
        </div>
    );
}