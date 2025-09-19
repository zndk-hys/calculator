import { contexts } from "./contexts";
import { State } from "./types";

const initialState: State = {
    context: contexts.INIT,
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
}

export default initialState;