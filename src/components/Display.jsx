import { states } from "../states";
import SegmentsDisplay from "./SegmentsDisplay";

export default function Display({state}) {
    let display = '';

    switch(state.state) {
        case states.INIT   : display = '0'; break;
        case states.IN_INT : display = state.operandRight; break;
        case states.IN_FRAC: display = state.operandRight; break;
        case states.PEND_R : display = state.operandLeft; break;
        case states.PEND_OP: display = state.operandRight; break;
        case states.RESULT : display = state.operandLeft; break;
        case states.ERROR  : display = 'error'; break;
    }

    return (
        <>
            <p>{display}</p>
            <SegmentsDisplay value={display} length={state.length} />
        </>
    )
}