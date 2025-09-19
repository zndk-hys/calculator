import { actions } from "../actions";
import { contexts } from "../contexts";

export default function invaderReducer(state, action) {
    switch (action.type) {
        case actions.INV_PLAY  : return handlePlayInvaderAction(state);
        case actions.INV_TICK  : return handleTickInvaderAction(state, action);
        case actions.INV_END   : return handleEndInvaderAction(state);
        case actions.DOT       : return handleDotAction(state);
        case actions.OP        : return handleOperatorAction(state, action);
        case actions.All_CLEAR : return handleAllClearAction(state, action);
        default: return state;
    }
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

function handleDotAction(state) {
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

function handleOperatorAction(state, action) {
    const operator = action.payload.kind;
    
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

function handleAllClearAction(state) {
    return {
        ...state,
        context: contexts.INIT,
        operandLeft: null,
        operandRight: null,
        operator: null,
    };
}