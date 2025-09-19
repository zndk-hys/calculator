import { useReducer } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import { calcReducer, initialState } from '../reducer';
import { actions } from '../actions';
import useInvaderGame from '../hooks/useInvaderGame';

export default function Calc({length}) {
    const [state, dispatch] = useReducer(calcReducer, {
        ...initialState,
        length,
    });

    // インベーダーゲーム用処理
    useInvaderGame(state, dispatch);
    
    return (
        <div>
            <Display state={state} />
            <Keypad
                onNum={e => dispatch({type: actions.NUM, payload: {kind: e.target.value}})}
                onClear={() => dispatch({type: actions.CLEAR})}
                onAllClear={() => dispatch({type: actions.All_CLEAR})}
                onDot={() => dispatch({type: actions.DOT})}
                onOperator={e => dispatch({type: actions.OP, payload: {kind: e.target.value}})}
                onMemory={e => dispatch({type: actions.MEM, payload: {kind: e.target.value}})}
                onMemoryRecall={() => dispatch({type: actions.MEM_RECALL})}
                onMemoryClear={() => dispatch({type: actions.MEM_CLEAR})}
                onEqual={() => dispatch({type: actions.EQUAL})}
                onStartInvader={() => dispatch({type: actions.INV_START})}
            />
            <div>
                state: {state.state}<br />
                operandLeft: {state.operandLeft}<br />
                operandRight: {state.operandRight}<br />
                operator: {state.operator}<br />
                memory: {state.memory}<br />
                point: {state.point}
            </div>
        </div>
    );
}