import { actions } from "./actions";
import { states } from "./states";
import { calcFormula } from "./utils";

export const initialState = {
    state: states.INIT, // init | intput_int | input_frac | pend_op | pend_right | result | error
    operandLeft: null,
    operandRight: null,
    operator: null,
    memory: '0',
};

function handleNumAction(state, action) {
    const inputNum = String(action.payload.kind);
        
    if (state.state === states.INIT || state.state === states.PEND_R || state.state === states.PEND_OP || state.state === states.RESULT || state.state === states.ERROR ) {
        // RESULT → 数値入力の場合はオペレーターをリセット
        const operator = state.state === states.RESULT ? null : state.operator;
        return {
            ...state,
            state: states.IN_INT,
            operandRight: inputNum,
            operator,
        };
    }

    if (state.state === states.IN_INT || state.state === states.IN_FRAC) {
        const newVal = state.operandRight === '0' ? inputNum : state.operandRight + inputNum;
        return {
            ...state,
            operandRight: newVal,
        };
    }

    return state;
}

function handleOperatorAction(state, action) {
    const operator = action.payload.kind;

    if (state.state === states.INIT || state.state === states.ERROR ) {
        if ( operator === '-' ) {
            return {
                ...state,
                state: states.IN_INT,
                operandRight: '-',
            }
        }
        return {
            ...state,
            state: states.PEND_R,
            operandLeft: '0',
            operandRight: null,
            operator,
        }
    }

    if (state.state === states.RESULT) {
        return {
            ...state,
            state: states.PEND_R,
            operator,
        }
    }

    if (state.state === states.IN_INT || state.state === states.IN_FRAC || state.state === states.PEND_OP ) {
        let newOperandLeft = state.operandRight;
        if ( state.operandLeft && state.operator ) {
            try {
                newOperandLeft = calcFormula(state.operandLeft, state.operandRight, state.operator);
            } catch {
                return {
                    ...state,
                    state: states.ERROR,
                    operandLeft: null,
                    operandRight: null,
                    operator: null,
                }
            }
        }
        return {
            ...state,
            state: states.PEND_R,
            operandLeft: newOperandLeft,
            operandRight: null,
            operator,
        }
    }

    if (state.state === states.PEND_R) {
        if ( operator === '-' ) {
            return {
                ...state,
                state: states.IN_INT,
                operandRight: '-',
            }
        }
    }

    return state;
}

function handleEqualAction(state, action) {
    if (state.state === states.IN_INT || state.state === states.IN_FRAC || state.state === states.PEND_OP) {
        if ( state.operandRight === '-' ) return state;
        
        if ( state.operandLeft && state.operator ) {
            try {
                const result = calcFormula(state.operandLeft, state.operandRight, state.operator);

                return {
                    ...state,
                    state: states.RESULT,
                    operandLeft: result,
                }
            } catch {
                return {
                    ...state,
                    state: states.ERROR,
                    operandLeft: null,
                    operandRight: null,
                    operator: null,
                }
            }
        }
    }

    return state;
}

function handleClearAction(state, action) {
    return {
        ...state,
        state: states.INIT,
        operandLeft: null,
        operandRight: null,
        operator: null,
    };
}

function handleDotAction(state, action) {
    if (state.state === states.INIT || state.state === states.PEND_R || state.state === states.PEND_OP || state.state === states.RESULT || state.state === states.ERROR ) {
        return {
            ...state,
            state: states.IN_FRAC,
            operandRight: '0.',
        };
    }

    if (state.state === states.IN_INT) {
        return {
            ...state,
            state: states.IN_FRAC,
            operandRight: state.operandRight + '.',
        };
    }

    if (state.state === states.IN_FRAC) {
        return state;
    }

    return state;
}

function handleMemoryAction(state, action) {
    const operator = action.payload.kind === 'M+' ? '+' : '-';
    if (state.state === states.IN_INT || state.state === states.IN_FRAC || state.state === states.PEND_OP || state.state === states.RESULT ) {
        try {
            const result = calcFormula(state.memory, state.operandRight, operator);

            return {
                ...state,
                state: states.PEND_OP,
                memory: result,
            }
        } catch {
            return {
                ...state,
                state: states.ERROR,
                operandLeft: null,
                operandRight: null,
                operator: null,
            }
        }
    }

    return state;
}

function handleMemoryRecallAction(state, action) {
    return {
        ...state,
        state: states.PEND_OP,
        operandRight: state.memory,
    }
}

function handleMemoryClearAction(state, action) {
    return {
        ...state,
        memory: '0',
    }
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
export function calcReducer(state, action) {
    switch (action.type) {
        case actions.NUM        : return handleNumAction(state, action);
        case actions.CLEAR      : return handleClearAction(state, action);
        case actions.OP         : return handleOperatorAction(state, action);
        case actions.EQUAL      : return handleEqualAction(state, action);
        case actions.DOT        : return handleDotAction(state, action);
        case actions.MEM        : return handleMemoryAction(state, action);
        case actions.MEM_RECALL : return handleMemoryRecallAction(state, action);
        case actions.MEM_CLEAR  : return handleMemoryClearAction(state, action);
    }
}