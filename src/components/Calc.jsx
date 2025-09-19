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
            <Keypad dispatch={dispatch} />
            <div>
                state: {state.state}<br />
                operandLeft: {state.operandLeft}<br />
                operandRight: {state.operandRight}<br />
                operator: {state.operator}<br />
                memory: {state.memory}<br />
                point: {state.point}<br />
                popedEnemyNum: {state.popedEnemyNum}
            </div>
        </div>
    );
}