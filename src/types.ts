import { actions } from './actions';
import { contexts } from './contexts';

export type Operator = '+' | '-' | '*' | '/';

type StateContext = 
    | typeof contexts.INIT
    | typeof contexts.IN_INT
    | typeof contexts.IN_FRAC
    | typeof contexts.PEND_OP
    | typeof contexts.PEND_R
    | typeof contexts.RESULT
    | typeof contexts.ERROR
    | typeof contexts.INV_POINT
    | typeof contexts.INV_PLAY
    | typeof contexts.INV_OVER
;

export interface State {
    context: StateContext,
    operandLeft: string | null,
    operandRight: string | null,
    operator: Operator | null,
    memory: string,
    length: number,

    /* インベーダー用 */
    stage: number,         // ステージ数
    point: number,         // 得点
    enemies: string,      // 出現中の敵
    tickCount: number,     // tickカウンタ
    popedEnemyNum: number, // 出現した敵の数
    life: number,          // 残りライフ
    aim: string,         // 照準
    sumHitNum: number,     // ヒットした合計（UFO出現判定用）
    comingUfo: boolean, // UFO出現フラグ
}

export type NumAction = {type: typeof actions.NUM, payload: {kind: string }};
export type OperatorAction = {type: typeof actions.OP, payload: {kind: Operator}};
export type MemoryAction = {type: typeof actions.MEM, payload: {kind: 'M+' | 'M-'}};
export type InvTickAction = {type: typeof actions.INV_TICK, payload: {newEnemy: string}};
export type SimpleAction = {
    type:
        | typeof actions.CLEAR
        | typeof actions.All_CLEAR
        | typeof actions.EQUAL
        | typeof actions.DOT
        | typeof actions.MEM_RECALL
        | typeof actions.MEM_CLEAR
        | typeof actions.INV_START
        | typeof actions.INV_PLAY
        | typeof actions.INV_END
}

export type AppAction = NumAction | OperatorAction | MemoryAction | InvTickAction | SimpleAction;