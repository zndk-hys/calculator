import { actions } from "../actions";
import { contexts, isCalculatorContext } from "../contexts";
import { AppAction, InvTickAction, OperatorAction, State } from "../types";

export default function invaderReducer(state: State, action: AppAction) {
    // 電卓モードの時はINV_STARTのみ受付け
    if (isCalculatorContext(state)) {
        if (action.type === actions.INV_START) {
            return handleStartInvaderAction(state);
        }
        return state;
    }

    switch (action.type) {
        case actions.INV_START : return handleStartInvaderAction(state);
        case actions.INV_PLAY  : return handlePlayInvaderAction(state);
        case actions.INV_TICK  : return handleTickInvaderAction(state, action as InvTickAction);
        case actions.DOT       : return handleDotAction(state);
        case actions.OP        : return handleOperatorAction(state, action as OperatorAction);
        case actions.All_CLEAR : return handleAllClearAction(state);
        default: return state;
    }
}

function handleStartInvaderAction(state: State): State {
    // インベーダーゲーム関連の状態を初期化
    return {
        ...state,
        invader: {
            ...state.invader,
            contextOffer: contexts.INV_POINT,
            stage: 1,
            life: 3,
            aim: '0',
            enemies: '',
            popedEnemyNum: 0,
            point: 0,
            comingUfo: false,
        }
    }
}

function handlePlayInvaderAction(state: State): State {
    return {
        ...state,
        invader: {
            ...state.invader,
            contextOffer: contexts.INV_PLAY,
        }
    };
}

function handleTickInvaderAction(state: State, action: InvTickAction): State {
    // 負け
    if (state.invader.enemies.length === state.displayLength - 4) {
        const life = state.invader.life - 1;

        if (life >0) {
            return {
                ...state,
                invader: {
                    ...state.invader,
                    contextOffer: contexts.INV_POINT,
                    aim: '0',
                    enemies: '',
                    popedEnemyNum: 0,
                    sumHitNum: 0,
                    life: state.invader.life - 1,
                }
            }
        } else {
            return {
                ...state,
                invader: {
                    ...state.invader,
                    contextOffer: contexts.INV_OVER,
                }
            }
        }
    }

    // 勝ち
    if (state.invader.popedEnemyNum === 16 && state.invader.enemies.trim().length === 0) {
        return {
            ...state,
            invader: {
                ...state.invader,
                contextOffer: contexts.INV_POINT,
                stage: state.invader.stage + 1,
                aim: '0',
                enemies: '',
                popedEnemyNum: 0,
                sumHitNum: 0,
            }
        }
    }

    // 敵排出
    let enemies = state.invader.enemies;
    let popedEnemyNum = state.invader.popedEnemyNum;
    if (popedEnemyNum < 16) {
        if (state.invader.comingUfo) {
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
        invader: {
            ...state.invader,
            tickCount: state.invader.tickCount++,
            enemies,
            popedEnemyNum,
            comingUfo: false,
        }
    };
}

function handleDotAction(state: State): State {
    if (state.context === contexts.INV_PLAY) {
        let aim = '0';
        switch(state.invader.aim) {
            case 'n': aim = '0'; break;
            case '9': aim = 'n'; break;
            default: aim = String(Number(state.invader.aim) + 1);
        }
        return {
            ...state,
            invader: {
                ...state.invader,
                aim,
            }
        }
    }

    return state;
}

function handleOperatorAction(state: State, action: OperatorAction): State {
    const operator = action.payload.kind;

    if (state.context === contexts.INV_PLAY && operator === '+') {
        const aim = state.invader.aim;
        const enemies = state.invader.enemies;
        const padEnemies = enemies.padStart(state.displayLength - 4, ' ');
        let point = 0;
        let hit = false;

        for (let i = 0; i < padEnemies.length; i++) {
            if (padEnemies.charAt(i) === aim) {
                hit = true;
                if (aim === 'n') point += 300;
                else point += (i+1) * 10;
            }
        }

        let sumHitNum = state.invader.sumHitNum;
        let comingUfo = state.invader.comingUfo;
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
            invader: {
                ...state.invader,
                enemies: enemies.replaceAll(aim, ''),
                point: state.invader.point + point,
                sumHitNum,
                comingUfo,
            }
        }
    }

    return state;
}

function handleAllClearAction(state: State): State {
    return {
        ...state,
        invader: {
            ...state.invader,
            contextOffer: contexts.INIT,
        }
    };
}