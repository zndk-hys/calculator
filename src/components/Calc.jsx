import { useReducer } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import useInvaderGame from '../hooks/useInvaderGame';
import initialState from '../initialState';
import rootReducer from '../reducers/rootReducer';

export default function Calc({length}) {
    const [state, dispatch] = useReducer(rootReducer, {
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
                context: {state.context}<br />
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