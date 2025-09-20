import { useReducer } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import useInvaderGame from '../hooks/useInvaderGame';
import initialState from '../initialState';
import rootReducer from '../reducers/rootReducer';

type CalcProps = {
    displayLength: number;
}

export default function Calc({displayLength}: CalcProps) {
    const [state, dispatch] = useReducer(rootReducer, {
        ...initialState,
        displayLength,
    });

    // インベーダーゲーム用処理
    useInvaderGame(state, dispatch);
    
    return (
        <div>
            <Display state={state} />
            <Keypad dispatch={dispatch} />
            <div>
                context: {state.context}<br />
                operandLeft: {state.calcurator.operandLeft}<br />
                operandRight: {state.calcurator.operandRight}<br />
                operator: {state.calcurator.operator}<br />
                memory: {state.calcurator.memory}<br />
                point: {state.invader.point}<br />
                popedEnemyNum: {state.invader.popedEnemyNum}
            </div>
        </div>
    );
}