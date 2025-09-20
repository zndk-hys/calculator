import { actions } from "../actions";
import { contexts, isInvaderContext } from "../contexts";
import { calcFormula, numLength } from "../utils";
import { State, AppAction, NumAction, OperatorAction, MemoryAction } from "../types";

export default function calcuratorReducer(state: State, action: AppAction): State {
    // インベーダーゲームモードの場合はINV_ENDのみ受付け
    if (isInvaderContext(state)) {
        if (action.type === actions.INV_END) {
            return handleEndInvaderAction(state);
        }
        return state;
    }

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
        case actions.INV_START  : return handleStartInvaderAction(state);
        default: return state;
    }
}

function handleNumAction(state: State, action: NumAction): State {
    const inputNum = action.payload.kind;
        
    if (state.context !== contexts.IN_INT && state.context !== contexts.IN_FRAC) {
        // 未入力時

        // RESULT → 数値入力の場合はオペレーターをリセット
        const operator = state.context === contexts.RESULT ? null : state.calcurator.operator;
        return {
            ...state,
            calcurator: {
                ...state.calcurator,
                contextOffer: contexts.IN_INT,
                operandRight: (inputNum === '00') ? '0' : inputNum,
                operator,
            }
        };

    } else {
        // 追加入力時

        let newVal = state.calcurator.operandRight;
        if (state.calcurator.operandRight === '0') {
            if (inputNum === '00') {
                newVal = '0';
            } else {
                newVal = inputNum;
            }
        } else {
            newVal += inputNum;
        }

        // 最大桁数以上の入力は無効
        if ( numLength(newVal!) > state.displayLength ) {
            return state;
        }

        return {
            ...state,
            calcurator: {
                ...state.calcurator,
                operandRight: newVal,
            }
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
                calcurator: {
                    ...state.calcurator,
                    contextOffer: contexts.IN_INT,
                    operandRight: '-',
                }
            }
        }
        return {
            ...state,
            calcurator: {
                ...state.calcurator,
                contextOffer: contexts.PEND_R,
                operandLeft: '0',
                operandRight: null,
                operator,
            }
        }
    }

    // 結果が表示されている状態では全てのオペレータを許容
    if (state.context === contexts.RESULT) {
        return {
            ...state,
            calcurator: {
                ...state.calcurator,
                contextOffer: contexts.PEND_R,
                operator,
            }
        }
    }

    // 入力中またはメモリ取得後の状態では全てのオペレータを許容し、必要であれば計算
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP ) {
        let newOperandLeft = state.calcurator.operandRight;
        if ( state.calcurator.operandLeft && state.calcurator.operandRight && state.calcurator.operator ) {
            try {
                newOperandLeft = calcFormula(state.calcurator.operandLeft, state.calcurator.operandRight, state.calcurator.operator);
                if ( numLength( newOperandLeft ) > state.displayLength ) {
                    throw new Error('too long');
                }

                return {
                    ...state,
                    calcurator: {
                        ...state.calcurator,
                        contextOffer: contexts.PEND_R,
                        operandLeft: newOperandLeft,
                        operandRight: null,
                        operator,
                    }
                }
            } catch {
                return {
                    ...state,
                    calcurator: {
                        ...state.calcurator,
                        contextOffer: contexts.ERROR,
                        operandLeft: null,
                        operandRight: null,
                        operator: null,
                    }
                }
            }
        }

        return {
            ...state,
            calcurator: {
                ...state.calcurator,
                contextOffer: contexts.PEND_R,
                operandLeft: newOperandLeft,
                operandRight: null,
                operator,
            }
        }
    }

    // 右オペランド待ちの場合はマイナス入力のための'-'のみ許容
    if (state.context === contexts.PEND_R) {
        if ( operator === '-' ) {
            return {
                ...state,
                calcurator: {
                    ...state.calcurator,
                    contextOffer: contexts.IN_INT,
                    operandRight: '-',
                }
            }
        }
    }

    return state;
}

function handleEqualAction(state: State): State {
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP || state.context === contexts.RESULT) {
        if ( state.calcurator.operandRight === '-' ) return state;
        
        if ( state.calcurator.operandLeft && state.calcurator.operandRight && state.calcurator.operator ) {
            try {
                const result = calcFormula(state.calcurator.operandLeft, state.calcurator.operandRight, state.calcurator.operator);

                if ( numLength( result ) > state.displayLength ) {
                    throw new Error('too long');
                }

                return {
                    ...state,
                    calcurator: {
                        ...state.calcurator,
                        contextOffer: contexts.RESULT,
                        operandLeft: result,
                    }
                }
            } catch {
                return {
                    ...state,
                    calcurator: {
                        ...state.calcurator,
                        contextOffer: contexts.ERROR,
                        operandLeft: null,
                        operandRight: null,
                        operator: null,
                    }
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
            calcurator: {
                ...state.calcurator,
                contextOffer: contexts.IN_INT,
                operandRight: '0',
            }
        };
    }

    return state;
}

function handleAllClearAction(state: State): State {
    return {
        ...state,
        calcurator: {
            ...state.calcurator,
            contextOffer: contexts.INIT,
            operandLeft: null,
            operandRight: null,
            operator: null,
        }
    };
}

function handleDotAction(state: State): State {
    // 未入力状態で.を押した際は「0.」として扱う
    if (state.context === contexts.INIT || state.context === contexts.PEND_R || state.context === contexts.PEND_OP || state.context === contexts.RESULT || state.context === contexts.ERROR ) {
        // RESULT → 小数点入力の場合はオペレーターをリセット
        const operator = state.context === contexts.RESULT ? null : state.calcurator.operator;

        return {
            ...state,
            calcurator: {
                ...state.calcurator,
                contextOffer: contexts.IN_FRAC,
                operandRight: '0.',
                operator,
            }
        };
    }

    if (state.context === contexts.IN_INT) {
        return {
            ...state,
            calcurator: {
                ...state.calcurator,
                contextOffer: contexts.IN_FRAC,
                operandRight: state.calcurator.operandRight + '.',
            }
        };
    }

    return state;
}

function handleMemoryAction(state: State, action: MemoryAction): State {
    const operator = action.payload.kind === 'M+' ? '+' : '-';
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP || state.context === contexts.RESULT ) {
        try {
            if ( state.calcurator.operandRight ) {
                const result = calcFormula(state.calcurator.memory, state.calcurator.operandRight, operator);
    
                return {
                    ...state,
                    calcurator: {
                        ...state.calcurator,
                        contextOffer: contexts.PEND_OP,
                        memory: result,
                    }
                }
            }
        } catch {
            return {
                ...state,
                calcurator: {
                    ...state.calcurator,
                    contextOffer: contexts.ERROR,
                    operandLeft: null,
                    operandRight: null,
                    operator: null,
                }
            }
        }
    }

    return state;
}

function handleMemoryRecallAction(state: State): State {
    return {
        ...state,
        calcurator: {
            ...state.calcurator,
            contextOffer: contexts.PEND_OP,
            operandRight: state.calcurator.memory,
        }
    }
}

function handleMemoryClearAction(state: State): State {
    return {
        ...state,
        calcurator: {
            ...state.calcurator,
            memory: '0',
        }
    }
}

function handleStartInvaderAction(state: State): State {
    // インベーダーゲーム中は無視
    if ( isInvaderContext( state ) ) {
        return state;
    }

    // インベーダーゲーム関連の状態を初期化
    return {
        ...state,
        calcurator: {
            ...state.calcurator,
            contextOffer: contexts.INV_POINT,
        }
    }
}

function handleEndInvaderAction(state: State): State {
    // 電卓関連の状態を初期化
    return {
        ...state,
        calcurator: {
            ...state.calcurator,
            contextOffer: contexts.INIT,
            operandLeft: null,
            operandRight: null,
            operator: null,
        }
    };
}