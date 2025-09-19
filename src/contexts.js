export const contexts = {
    INIT: 'init',
    IN_INT: 'input_int',
    IN_FRAC: 'input_frac',
    PEND_OP: 'pend_op',
    PEND_R: 'pend_right',
    RESULT: 'result',
    ERROR: 'error',
    INV_POINT: 'invader_point',
    INV_PLAY: 'invader_playing',
    INV_OVER: 'invader_gameover'
}

export function isCalculatorContext(state) {
    return [
        contexts.INIT,
        contexts.IN_INT,
        contexts.IN_FRAC,
        contexts.PEND_OP,
        contexts.PEND_R,
        contexts.RESULT,
        contexts.ERROR,
    ].includes(state.context);
}

export function isInvaderContext(state) {
    return [
        contexts.INV_POINT,
        contexts.INV_PLAY,
        contexts.INV_POINT,
    ]
}