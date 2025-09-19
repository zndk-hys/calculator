import { actions } from "../actions";
import { contexts } from "../contexts";
import { calcFormula, numLength } from "../utils";
import { State, AppAction, NumAction, OperatorAction, MemoryAction } from "../types";

export default function calcuratorReducer(state: State, action: AppAction): State {
    switch (action.type) {
        case actions.NUM        : return handleNumAction(state, action as NumAction);
        case actions.CLEAR      : return handleClearAction(state);
        case actions.All_CLEAR  : return handleAllClearAction(state);
        case actions.OP         : return handleOperatorAction(state, action as OperatorAction);
        case actions.EQUAL      : return handleEqualAction(state);
        case actions.DOT        : return handleDotAction(state);
        case actions.MEM        : return handleMemoryAction(state, action as MemoryAction);
        case actions.MEM_RECALL : return handleMemoryRecallAction(state);
        case actions.MEM_CLEAR  : return handleMemoryClearAction(state);
        case actions.INV_START : return handleStartInvaderAction(state);
        default: return state;
    }
}

function handleNumAction(state: State, action: NumAction): State {
    const inputNum = String(action.payload.kind);
        
    if (state.context !== contexts.IN_INT && state.context !== contexts.IN_FRAC) {
        // 未入力時

        // RESULT → 数値入力の場合はオペレーターをリセット
        const operator = state.context === contexts.RESULT ? null : state.operator;
        return {
            ...state,
            context: contexts.IN_INT,
            operandRight: inputNum,
            operator,
        };

    } else {
        // 追加入力時

        // 最大桁数以上の入力は無効
        if ( numLength(state.operandRight!) >= state.length ) {
            return state;
        }

        const newVal = state.operandRight === '0' ? inputNum : state.operandRight + inputNum;
        return {
            ...state,
            operandRight: newVal,
        };
    }
}

function handleOperatorAction(state: State, action: OperatorAction): State {
    const operator = action.payload.kind;

    // 初期状態またはエラー状態の場合、全てのオペレーターを許容するが、
    // 「-」の場合はマイナス値入力のためのオペレーターとして扱う
    if (state.context === contexts.INIT || state.context === contexts.ERROR ) {
        if ( operator === '-' ) {
            return {
                ...state,
                context: contexts.IN_INT,
                operandRight: '-',
            }
        }
        return {
            ...state,
            context: contexts.PEND_R,
            operandLeft: '0',
            operandRight: null,
            operator,
        }
    }

    // 結果が表示されている状態では全てのオペレータを許容
    if (state.context === contexts.RESULT) {
        return {
            ...state,
            context: contexts.PEND_R,
            operator,
        }
    }

    // 入力中またはメモリ取得後の状態では全てのオペレータを許容し、必要であれば計算
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP ) {
        let newOperandLeft = state.operandRight;
        if ( state.operandLeft && state.operandRight && state.operator ) {
            try {
                newOperandLeft = calcFormula(state.operandLeft, state.operandRight, state.operator);
                if ( numLength( newOperandLeft ) > state.length ) {
                    throw new Error('too long');
                }

                return {
                    ...state,
                    context: contexts.PEND_R,
                    operandLeft: newOperandLeft,
                    operandRight: null,
                    operator,
                }
            } catch {
                return {
                    ...state,
                    context: contexts.ERROR,
                    operandLeft: null,
                    operandRight: null,
                    operator: null,
                }
            }
        }

        return {
            ...state,
            context: contexts.PEND_R,
            operandLeft: newOperandLeft,
            operandRight: null,
            operator,
        }
    }

    // 右オペランド待ちの場合はマイナス入力のための'-'のみ許容
    if (state.context === contexts.PEND_R) {
        if ( operator === '-' ) {
            return {
                ...state,
                context: contexts.IN_INT,
                operandRight: '-',
            }
        }
    }

    return state;
}

function handleEqualAction(state: State): State {
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP || state.context === contexts.RESULT) {
        if ( state.operandRight === '-' ) return state;
        
        if ( state.operandLeft && state.operandRight && state.operator ) {
            try {
                const result = calcFormula(state.operandLeft, state.operandRight, state.operator);

                if ( numLength( result ) > state.length ) {
                    throw new Error('too long');
                }

                return {
                    ...state,
                    context: contexts.RESULT,
                    operandLeft: result,
                }
            } catch {
                return {
                    ...state,
                    context: contexts.ERROR,
                    operandLeft: null,
                    operandRight: null,
                    operator: null,
                }
            }
        }
    }

    return state;
}

function handleClearAction(state: State): State {
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.RESULT) {
        return {
            ...state,
            context: contexts.IN_INT,
            operandRight: '0',
        };
    }

    return state;
}

function handleAllClearAction(state: State): State {
    return {
        ...state,
        context: contexts.INIT,
        operandLeft: null,
        operandRight: null,
        operator: null,
    };
}

function handleDotAction(state: State): State {
    // 未入力状態で.を押した際は「0.」として扱う
    if (state.context === contexts.INIT || state.context === contexts.PEND_R || state.context === contexts.PEND_OP || state.context === contexts.RESULT || state.context === contexts.ERROR ) {
        // RESULT → 小数点入力の場合はオペレーターをリセット
        const operator = state.context === contexts.RESULT ? null : state.operator;

        return {
            ...state,
            context: contexts.IN_FRAC,
            operandRight: '0.',
            operator,
        };
    }

    if (state.context === contexts.IN_INT) {
        return {
            ...state,
            context: contexts.IN_FRAC,
            operandRight: state.operandRight + '.',
        };
    }

    return state;
}

function handleMemoryAction(state: State, action: MemoryAction): State {
    const operator = action.payload.kind === 'M+' ? '+' : '-';
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP || state.context === contexts.RESULT ) {
        try {
            if ( state.operandRight ) {
                const result = calcFormula(state.memory, state.operandRight, operator);
    
                return {
                    ...state,
                    context: contexts.PEND_OP,
                    memory: result,
                }
            }
        } catch {
            return {
                ...state,
                context: contexts.ERROR,
                operandLeft: null,
                operandRight: null,
                operator: null,
            }
        }
    }

    return state;
}

function handleMemoryRecallAction(state: State): State {
    return {
        ...state,
        context: contexts.PEND_OP,
        operandRight: state.memory,
    }
}

function handleMemoryClearAction(state: State): State {
    return {
        ...state,
        memory: '0',
    }
}

function handleStartInvaderAction(state: State): State {
    return {
        ...state,
        context: contexts.INV_POINT,
        stage: 1,
        life: 3,
        aim: '0',
        enemies: '',
        popedEnemyNum: 0,
        point: 0,
        comingUfo: false,
    }
}