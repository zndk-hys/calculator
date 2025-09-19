import { actions } from "../actions";

export default function Keypad({dispatch}) {
    const onNum = (e) => dispatch({type: actions.NUM, payload: {kind: e.target.value}});
    const onClear = () => dispatch({type: actions.CLEAR});
    const onAllClear = () => dispatch({type: actions.All_CLEAR});
    const onDot= () => dispatch({type: actions.DOT});
    const onOperator = (e) => dispatch({type: actions.OP, payload: {kind: e.target.value}});
    const onMemory = (e) => dispatch({type: actions.MEM, payload: {kind: e.target.value}});
    const onMemoryRecall = () => dispatch({type: actions.MEM_RECALL});
    const onMemoryClear = () => dispatch({type: actions.MEM_CLEAR});
    const onEqual = () => dispatch({type: actions.EQUAL});
    const onStartInvader = () => dispatch({type: actions.INV_START});

    return (
        <div>
            <input type="button" value="0" onClick={onNum} />
            <input type="button" value="1" onClick={onNum} />
            <input type="button" value="2" onClick={onNum} />
            <input type="button" value="3" onClick={onNum} />
            <input type="button" value="4" onClick={onNum} />
            <input type="button" value="5" onClick={onNum} />
            <input type="button" value="6" onClick={onNum} />
            <input type="button" value="7" onClick={onNum} />
            <input type="button" value="8" onClick={onNum} />
            <input type="button" value="9" onClick={onNum} />
            <input type="button" value="C" onClick={onClear} />
            <input type="button" value="AC" onClick={onAllClear} /><br />
            <input type="button" value="." onClick={onDot} /><br />
            <input type="button" value="+" onClick={onOperator} />
            <input type="button" value="-" onClick={onOperator} />
            <input type="button" value="*" onClick={onOperator} />
            <input type="button" value="/" onClick={onOperator} /><br />
            <input type="button" value="M+" onClick={onMemory} />
            <input type="button" value="M-" onClick={onMemory} />
            <input type="button" value="MR" onClick={onMemoryRecall} />
            <input type="button" value="MC" onClick={onMemoryClear} /><br />
            <input type="button" value="=" onClick={onEqual} /><br />
            <input type="button" value="invader" onClick={onStartInvader} />
        </div>
    )
}