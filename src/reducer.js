import { actions } from "./actions";
import { contexts } from "./contexts";
import { calcFormula, numLength } from "./utils";

export const initialState = {
    context: contexts.INIT, // init | intput_int | input_frac | pend_op | pend_right | result | error
    operandLeft: null,
    operandRight: null,
    operator: null,
    memory: '0',
    length: 10,

    /* インベーダー用 */
    stage: 0,         // ステージ数
    point: 0,         // 得点
    enemies: '',      // 出現中の敵
    tickCount: 0,     // tickカウンタ
    popedEnemyNum: 0, // 出現した敵の数
    life: 3,          // 残りライフ
    aim: '0',         // 照準
    sumHitNum: 0,     // ヒットした合計（UFO出現判定用）
    comingUfo: false, // UFO出現フラグ
};

function handleNumAction(state, action) {
    const inputNum = String(action.payload.kind);
        
    if (state.context === contexts.INIT || state.context === contexts.PEND_R || state.context === contexts.PEND_OP || state.context === contexts.RESULT || state.context === contexts.ERROR ) {
        // RESULT → 数値入力の場合はオペレーターをリセット
        const operator = state.context === contexts.RESULT ? null : state.operator;
        return {
            ...state,
            context: contexts.IN_INT,
            operandRight: inputNum,
            operator,
        };
    }

    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC) {
        // 最大桁数以上の入力は無効
        if ( numLength(state.operandRight) >= state.length ) {
            return state;
        }

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

    if (state.context === contexts.RESULT) {
        return {
            ...state,
            context: contexts.PEND_R,
            operator,
        }
    }

    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP ) {
        let newOperandLeft = state.operandRight;
        if ( state.operandLeft && state.operator ) {
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

    if (state.context === contexts.PEND_R) {
        if ( operator === '-' ) {
            return {
                ...state,
                context: contexts.IN_INT,
                operandRight: '-',
            }
        }
    }

    // インベーダー：fire
    if (state.context === contexts.INV_PLAY && operator === '+') {
        const aim = state.aim;
        const enemies = state.enemies;
        const padEnemies = enemies.padStart(state.length - 4, ' ');
        let point = 0;
        let hit = false;

        for (let i = 0; i < padEnemies.length; i++) {
            if (padEnemies.charAt(i) === aim) {
                hit = true;
                if (aim === 'n') point += 300;
                else point += (i+1) * 10;
            }
        }

        let sumHitNum = state.sumHitNum;
        let comingUfo = state.comingUfo;
        if (hit) {
            if (aim !== 'n') {
                sumHitNum += Number(aim);
            }
            if (sumHitNum % 10 === 0) {
                comingUfo = true;
            }
        }

        return {
            ...state,
            enemies: enemies.replaceAll(aim, ''),
            point: state.point + point,
            sumHitNum,
            comingUfo,
        }
    }

    return state;
}

function handleEqualAction(state) {
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP || state.context === contexts.RESULT) {
        if ( state.operandRight === '-' ) return state;
        
        if ( state.operandLeft && state.operator ) {
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

function handleClearAction(state) {
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.RESULT) {
        return {
            ...state,
            context: contexts.IN_INT,
            operandRight: '0',
        };
    }
}

function handleAllClearAction(state) {
    return {
        ...state,
        context: contexts.INIT,
        operandLeft: null,
        operandRight: null,
        operator: null,
    };
}

function handleDotAction(state) {
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

    if (state.context === contexts.IN_FRAC) {
        return state;
    }

    if (state.context === contexts.INV_PLAY) {
        let aim = '0';
        switch(state.aim) {
            case 'n': aim = '0'; break;
            case '9': aim = 'n'; break;
            default: aim = String(Number(state.aim) + 1);
        }
        return {
            ...state,
            aim,
        }
    }

    return state;
}

function handleMemoryAction(state, action) {
    const operator = action.payload.kind === 'M+' ? '+' : '-';
    if (state.context === contexts.IN_INT || state.context === contexts.IN_FRAC || state.context === contexts.PEND_OP || state.context === contexts.RESULT ) {
        try {
            const result = calcFormula(state.memory, state.operandRight, operator);

            return {
                ...state,
                context: contexts.PEND_OP,
                memory: result,
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

function handleMemoryRecallAction(state) {
    return {
        ...state,
        context: contexts.PEND_OP,
        operandRight: state.memory,
    }
}

function handleMemoryClearAction(state) {
    return {
        ...state,
        memory: '0',
    }
}

function handleStartInvaderAction(state) {
    // 電卓モードの場合
    if (state.context !== contexts.INV_POINT && state.context !== contexts.INV_PLAY) {
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

    return state;
}

function handlePlayInvaderAction(state) {
    return {
        ...state,
        context: contexts.INV_PLAY,
    };
}

function handleTickInvaderAction(state, action) {
    // 負け
    if (state.enemies.length === state.length - 4) {
        const life = state.life - 1;

        if (life >0) {
            return {
                ...state,
                context: contexts.INV_POINT,
                aim: '0',
                enemies: '',
                popedEnemyNum: 0,
                sumHitNum: 0,
                life: state.life - 1,
            }
        } else {
            return {
                ...state,
                context: contexts.INV_OVER,
            }
        }
    }

    // 勝ち
    if (state.popedEnemyNum === 16 && state.enemies.trim().length === 0) {
        return {
            ...state,
            context: contexts.INV_POINT,
            stage: state.stage + 1,
            aim: '0',
            enemies: '',
            popedEnemyNum: 0,
            sumHitNum: 0,
        }
    }

    // 敵排出
    let enemies = state.enemies;
    let popedEnemyNum = state.popedEnemyNum;
    if (popedEnemyNum < 16) {
        if (state.comingUfo) {
            enemies += 'n';
        } else {
            enemies += action.payload.newEnemy;
        }
        popedEnemyNum++;
    } else {
        enemies += ' ';
    }

    return {
        ...state,
        tickCount: state.tickCount++,
        enemies,
        popedEnemyNum,
        comingUfo: false,
    };
}

function handleEndInvaderAction(state) {
    return {
        ...state,
        context: contexts.INIT,
        operandLeft: null,
        operandRight: null,
        operator: null,
    };
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
        case actions.CLEAR      : return handleClearAction(state);
        case actions.All_CLEAR  : return handleAllClearAction(state);
        case actions.OP         : return handleOperatorAction(state, action);
        case actions.EQUAL      : return handleEqualAction(state);
        case actions.DOT        : return handleDotAction(state);
        case actions.MEM        : return handleMemoryAction(state, action);
        case actions.MEM_RECALL : return handleMemoryRecallAction(state);
        case actions.MEM_CLEAR  : return handleMemoryClearAction(state);
        case actions.INV_START  : return handleStartInvaderAction(state);
        case actions.INV_PLAY   : return handlePlayInvaderAction(state);
        case actions.INV_TICK   : return handleTickInvaderAction(state, action);
        case actions.INV_END    : return handleEndInvaderAction(state);
    }
}