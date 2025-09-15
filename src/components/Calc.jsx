import { useReducer } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import { calcReducer, initialState } from '../reducer';
import { actions } from '../actions';

export default function Calc({length}) {
    const [state, dispatch] = useReducer(calcReducer, {
        ...initialState,
        length,
    });
    
    return (
        <div>
            <Display state={state} />
            <Keypad
                onNum={e => dispatch({type: actions.NUM, payload: {kind: e.target.value}})}
                onClear={e => dispatch({type: actions.CLEAR})}
                onDot={e => dispatch({type: actions.DOT})}
                onOperator={e => dispatch({type: actions.OP, payload: {kind: e.target.value}})}
                onMemory={e => dispatch({type: actions.MEM, payload: {kind: e.target.value}})}
                onMemoryRecall={e => dispatch({type: actions.MEM_RECALL})}
                onMemoryClear={e => dispatch({type: actions.MEM_CLEAR})}
                onEqual={e => dispatch({type: actions.EQUAL})}
            />
            <div>
                state: {state.state}<br />
                operandLeft: {state.operandLeft}<br />
                operandRight: {state.operandRight}<br />
                operator: {state.operator}<br />
                memory: {state.memory}
            </div>
        </div>
    );
}