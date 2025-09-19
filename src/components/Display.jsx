import { states } from "../states";
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

    switch(state.state) {
        case states.INIT      : display = '0'; break;
        case states.IN_INT    : display = state.operandRight; break;
        case states.IN_FRAC   : display = state.operandRight; break;
        case states.PEND_R    : display = state.operandLeft; break;
        case states.PEND_OP   : display = state.operandRight; break;
        case states.RESULT    : display = state.operandLeft; break;
        case states.ERROR     : display = 'error'; break;
        case states.INV_POINT : display = drawPointInvaderDisplay(state); break;
        case states.INV_PLAY  : display = drawPlayInvaderDisplay(state); break;
        case states.INV_OVER  : display = drawPointInvaderDisplay(state); break;
    }

    return (
        <>
            <p>{display}</p>
            <SegmentsDisplay value={display} length={state.length} />
        </>
    )
}