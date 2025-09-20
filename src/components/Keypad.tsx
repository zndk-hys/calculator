import './Keypad.css'
import { MouseEvent } from "react";
import { actions } from "../actions";
import { AppAction } from "../types";

type KeypadProps = {
    dispatch: React.ActionDispatch<[AppAction]>;
}

export default function Keypad({dispatch}: KeypadProps) {
    const onNum = (e: MouseEvent<HTMLInputElement>) => dispatch({type: actions.NUM, payload: {kind: e.currentTarget.value}});
    const onClear = () => dispatch({type: actions.CLEAR});
    const onAllClear = () => dispatch({type: actions.All_CLEAR});
    const onDot= () => dispatch({type: actions.DOT});
    const onOperator = (e: MouseEvent<HTMLInputElement>) => dispatch({type: actions.OP, payload: {kind: e.currentTarget.value}});
    const onMemory = (e: MouseEvent<HTMLInputElement>) => dispatch({type: actions.MEM, payload: {kind: e.currentTarget.value}});
    const onMemoryRecall = () => dispatch({type: actions.MEM_RECALL});
    const onMemoryClear = () => dispatch({type: actions.MEM_CLEAR});
    const onEqual = () => dispatch({type: actions.EQUAL});
    const onStartInvader = () => dispatch({type: actions.INV_START});

    return (
        <div>
            <div className="nums">
                <input type="button" className="btn game" value="Game" onClick={onStartInvader} />
                <input type="button" className="btn" value="M+" onClick={onMemory} />
                <input type="button" className="btn" value="M-" onClick={onMemory} />
                <input type="button" className="btn" value="MR" onClick={onMemoryRecall} />
                <input type="button" className="btn" value="MC" onClick={onMemoryClear} />

                <input type="button" className="btn" value="7" onClick={onNum} />
                <input type="button" className="btn" value="8" onClick={onNum} />
                <input type="button" className="btn" value="9" onClick={onNum} />
                <input type="button" className="btn c" value="C" onClick={onClear} />
                <input type="button" className="btn ac" value="AC" onClick={onAllClear} />

                <input type="button" className="btn" value="4" onClick={onNum} />
                <input type="button" className="btn" value="5" onClick={onNum} />
                <input type="button" className="btn" value="6" onClick={onNum} />
                <input type="button" className="btn" value="*" onClick={onOperator} />
                <input type="button" className="btn" value="/" onClick={onOperator} />

                <input type="button" className="btn" value="1" onClick={onNum} />
                <input type="button" className="btn" value="2" onClick={onNum} />
                <input type="button" className="btn" value="3" onClick={onNum} />
                <input type="button" className="btn plus" value="+" onClick={onOperator} />
                <input type="button" className="btn" value="-" onClick={onOperator} />

                <input type="button" className="btn" value="0" onClick={onNum} />
                <input type="button" className="btn" value="00" onClick={onNum} />
                <input type="button" className="btn" value="." onClick={onDot} />
                <input type="button" className="btn" value="=" onClick={onEqual} />
            </div>
        </div>
    )
}