import './Calc.css';
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
        <div className="calc">
            <Display state={state} />
            <Keypad dispatch={dispatch} />
        </div>
    );
}