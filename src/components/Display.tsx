import { contexts } from "../contexts";
import { State } from "../types";
import SegmentsDisplay from "./SegmentsDisplay";

type DisplayProps = {
    state: State,
}

export default function Display({state}: DisplayProps) {
    let display: string = '';

    switch(state.context) {
        case contexts.INIT      : display = '0'; break;
        case contexts.IN_INT    : display = state.operandRight!; break;
        case contexts.IN_FRAC   : display = state.operandRight!; break;
        case contexts.PEND_R    : display = state.operandLeft!; break;
        case contexts.PEND_OP   : display = state.operandRight!; break;
        case contexts.RESULT    : display = state.operandLeft!; break;
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

function drawPointInvaderDisplay(state: State) {
    const stage = String(state.stage).padStart(3, ' ');
    const point = String(state.point).padStart(state.length - 4, '0');
    return `${stage}-${point}`;
}

function drawPlayInvaderDisplay(state: State) {
    const aim = state.aim;
    const life = state.life === 3 ? ']' : state.life === 2 ? '>' : '-';
    const enemies = String(state.enemies).padStart(state.length - 4, ' ');
    return `  ${aim}${life}${enemies}`;
}