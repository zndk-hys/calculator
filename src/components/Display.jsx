import { contexts } from "../contexts";
import SegmentsDisplay from "./SegmentsDisplay";

function drawPointInvaderDisplay(state) {
    const stage = String(state.stage).padStart(3, ' ');
    const point = String(state.point).padStart(state.length - 4, '0');
    return `${stage}-${point}`;
}

function drawPlayInvaderDisplay(state) {
    const aim = state.aim;
    const life = state.life === 3 ? ']' : state.life === 2 ? '>' : '-';
    const enemies = String(state.enemies).padStart(state.length - 4, ' ');
    return `  ${aim}${life}${enemies}`;
}

export default function Display({state}) {
    let display = '';

    switch(state.context) {
        case contexts.INIT      : display = '0'; break;
        case contexts.IN_INT    : display = state.operandRight; break;
        case contexts.IN_FRAC   : display = state.operandRight; break;
        case contexts.PEND_R    : display = state.operandLeft; break;
        case contexts.PEND_OP   : display = state.operandRight; break;
        case contexts.RESULT    : display = state.operandLeft; break;
        case contexts.ERROR     : display = 'error'; break;
        case contexts.INV_POINT : display = drawPointInvaderDisplay(state); break;
        case contexts.INV_PLAY  : display = drawPlayInvaderDisplay(state); break;
        case contexts.INV_OVER  : display = drawPointInvaderDisplay(state); break;
    }

    return (
        <>
            <p>{display}</p>
            <SegmentsDisplay value={display} length={state.length} />
        </>
    )
}