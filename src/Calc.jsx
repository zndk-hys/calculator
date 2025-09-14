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

/**
 * |desc\src   |init       |input_int  |input_franc|pend_op    |pend_right |result     |error      |
 * |init       |o          |o          |o          |o          |o          |o          |o          |
 * |input_int  |o          |o          |x          |o          |o          |o          |o          |
 * |input_franc|o          |o          |o          |o          |o          |o          |o          |
 * |pend_op    |o          |o          |o          |o          |o          |o          |o          |
 * |pend_right |o          |o          |o          |o          |o          |o          |o          |
 * |result     |x          |o          |o          |o          |x          |x          |x          |
 * |error      |x          |o          |o          |o          |x          |x          |x          |
 * 
 * @param {*} state 
 * @param {*} action 
 * @returns 
 */
function calcReducer(state, action) {
    if (action.type === 'numKey') {
        const inputNum = String(action.payload.num);
        
        if (state.state === 'init' || state.state === 'pend_right' || state.state === 'pend_op' || state.state === 'result' || state.state === 'error' ) {
            return {
                ...state,
                state: 'input_int',
                operandRight: inputNum,
            };
        }

        if (state.state === 'input_int' || state.state === 'input_frac') {
            const newVal = state.operandRight === '0' ? inputNum : state.operandRight + inputNum;
            return {
                ...state,
                operandRight: newVal,
            };
        }

    } else if (action.type === 'clearKey') {
        return {
            ...state,
            state: 'init',
            operandLeft: null,
            operandRight: null,
            operator: null,
        };
    } else if (action.type === 'operatorKey') {
        const operator = action.payload.kind;

        if (state.state === 'init' || state.state === 'error' ) {
            if ( operator === '-' ) {
                return {
                    ...state,
                    state: 'input_int',
                    operandRight: '-',
                }
            }
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
                operator,
            }
        }

        if (state.state === 'input_int' || state.state === 'input_frac' || state.state === 'pend_op' ) {
            let newOperandLeft = state.operandRight;
            if ( state.operandLeft && state.operator ) {
                try {
                    newOperandLeft = calcFormula(state.operandLeft, state.operandRight, state.operator);
                } catch {
                    return {
                        ...state,
                        state: 'error',
                        operandLeft: null,
                        operandRight: null,
                        operator: null,
                    }
                }
            }
            return {
                ...state,
                state: 'pend_right',
                operandLeft: newOperandLeft,
                operandRight: null,
                operator,
            }
        }

        if (state.state === 'pend_right') {
            if ( operator === '-' ) {
                return {
                    ...state,
                    state: 'input_int',
                    operandRight: '-',
                }
            }
            return state;
        }

    } else if (action.type === 'equalKey') {
        if (state.state === 'input_int' || state.state === 'input_frac' || state.state === 'pend_op') {
            if ( state.operandRight === '-' ) return state;
            
            if ( state.operandLeft && state.operator ) {
                try {
                    const result = calcFormula(state.operandLeft, state.operandRight, state.operator);

                    return {
                        ...state,
                        state: 'result',
                        operandLeft: result,
                    }
                } catch {
                    return {
                        ...state,
                        state: 'error',
                        operandLeft: null,
                        operandRight: null,
                        operator: null,
                    }
                }
            }
        }
        
    } else if (action.type === 'dotKey') {
        if (state.state === 'init' || state.state === 'pend_right' || state.state === 'pend_op' || state.state === 'result' || state.state === 'error' ) {
            return {
                ...state,
                state: 'input_frac',
                operandRight: '0.',
            };
        }

        if (state.state === 'input_int') {
            return {
                ...state,
                state: 'input_frac',
                operandRight: state.operandRight + '.',
            };
        }

        if (state.state === 'input_frac') {
            return state;
        }

    } else if (action.type === 'memoryKey') {
        const operator = action.payload.kind === 'M+' ? '+' : '-';
        if (state.state === 'input_int' || state.state === 'input_frac' || state.state === 'pend_op' || state.state === 'result' ) {
            try {
                const result = calcFormula(state.memory, state.operandRight, operator);

                return {
                    ...state,
                    state: 'pend_op',
                    memory: result,
                }
            } catch {
                return {
                    ...state,
                    state: 'error',
                    operandLeft: null,
                    operandRight: null,
                    operator: null,
                }
            }
        }
    } else if (action.type === 'memoryRecallKey') {
        return {
            ...state,
            state: 'pend_op',
            operandRight: state.memory,
        }
    } else if (action.type === 'memoryClearKey') {
        return {
            ...state,
            memory: '0',
        }
    }
    return state;
}

function getDisplayValue(state) {
    switch(state.state) {
        case 'init': return '0';
        case 'input_int': return state.operandRight;
        case 'input_frac': return state.operandRight;
        case 'pend_right': return state.operandLeft;
        case 'pend_op': return state.operandRight;
        case 'result': return state.operandLeft;
        case 'error': return 'error';
    }
}

export default function Calc() {
    const [state, dispatch] = useReducer(calcReducer, {
        state: 'init', // init | intput_int | input_frac | pend_right | result | error
        operandLeft: null,
        operandRight: null,
        operator: null,
        memory: '0',
    });

    const handleNumKey = e => {
        dispatch({
            type: 'numKey',
            payload: {
                num: e.target.value,
            }
        })
    }

    const displayValue = getDisplayValue(state);

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

    const handleMemoryKey = e => {
        dispatch({
            type: 'memoryKey',
            payload: {
                kind: e.target.value,
            }
        });
    }

    const handleMemoryRecallKey = e => {
        dispatch({
            type: 'memoryRecallKey',
        });
    }

    const handleMemoryClearKey = e => {
        dispatch({
            type: 'memoryClearKey',
        })
    }
    
    return (
        <div>
            <p>{displayValue}</p>
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
            <input type="button" value="M+" onClick={handleMemoryKey} />
            <input type="button" value="M-" onClick={handleMemoryKey} />
            <input type="button" value="MR" onClick={handleMemoryRecallKey} />
            <input type="button" value="MC" onClick={handleMemoryClearKey} /><br />
            <input type="button" value="=" onClick={handleEqualKey} /><br />
            <div>
                state: {state.state}<br />
                operandLeft: {state.operandLeft}<br />
                operandRight: {state.operandRight}<br />
                operator: {state.operator}<br />
                memory: {state.memory}
            </div>
        </div>
    );
}