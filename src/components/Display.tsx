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
        case contexts.IN_INT    : display = state.calcurator.operandRight!; break;
        case contexts.IN_FRAC   : display = state.calcurator.operandRight!; break;
        case contexts.PEND_R    : display = state.calcurator.operandLeft!; break;
        case contexts.PEND_OP   : display = state.calcurator.operandRight!; break;
        case contexts.RESULT    : display = state.calcurator.operandLeft!; break;
        case contexts.ERROR     : display = 'error'; break;
        case contexts.INV_POINT : display = drawPointInvaderDisplay(state); break;
        case contexts.INV_PLAY  : display = drawPlayInvaderDisplay(state); break;
        case contexts.INV_OVER  : display = drawPointInvaderDisplay(state); break;
    }

    return (
        <>
            <SegmentsDisplay value={display} displayLength={state.displayLength} />
        </>
    )
}

function drawPointInvaderDisplay(state: State) {
    const stage = String(state.invader.stage).padStart(3, ' ');
    const point = String(state.invader.point).padStart(state.displayLength - 4, '0');
    return `${stage}-${point}`;
}

function drawPlayInvaderDisplay(state: State) {
    const aim = state.invader.aim;
    const life = state.invader.life === 3 ? ']' : state.invader.life === 2 ? '>' : '-';
    const enemies = String(state.invader.enemies).padStart(state.displayLength - 4, ' ');
    return `  ${aim}${life}${enemies}`;
}